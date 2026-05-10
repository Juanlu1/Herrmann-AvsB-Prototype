import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Answer } from "@/lib/herrmann-types"

interface SaveResultsBody {
  nombre: string
  apellido: string
  answers: Answer[]
}

export async function POST(req: NextRequest) {
  try {
    const body: SaveResultsBody = await req.json()
    const { nombre, apellido, answers } = body

    if (!nombre || !apellido || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 1. Crear participante
    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .insert({ nombre, apellido })
      .select("id")
      .single()

    if (participantError || !participant) {
      console.error("[v0] Error creando participante:", participantError)
      return NextResponse.json({ error: "Error al guardar participante" }, { status: 500 })
    }

    // 2. Crear sesión de test
    const { data: session, error: sessionError } = await supabase
      .from("test_sessions")
      .insert({
        participant_id: participant.id,
        total_questions: answers.length,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (sessionError || !session) {
      console.error("[v0] Error creando sesión:", sessionError)
      return NextResponse.json({ error: "Error al guardar sesión" }, { status: 500 })
    }

    // 3. Insertar respuestas
    const answersToInsert = answers.map((a) => ({
      session_id: session.id,
      question_id: a.questionId,
      choice: a.choice,
      quadrant: a.quadrant,
    }))

    const { error: answersError } = await supabase.from("answers").insert(answersToInsert)

    if (answersError) {
      console.error("[v0] Error guardando respuestas:", answersError)
      return NextResponse.json({ error: "Error al guardar respuestas" }, { status: 500 })
    }

    // 4. Calcular y guardar resultados por cuadrante
    // total = cuántas preguntas tenían ese cuadrante como opción elegible
    // selected = cuántas veces se eligió ese cuadrante
    const quadrantCounts: Record<string, { selected: number; total: number }> = {
      A: { selected: 0, total: 0 },
      B: { selected: 0, total: 0 },
      C: { selected: 0, total: 0 },
      D: { selected: 0, total: 0 },
    }

    for (const answer of answers) {
      // El cuadrante elegido suma en selected y total
      quadrantCounts[answer.quadrant].selected += 1
      quadrantCounts[answer.quadrant].total += 1
      // El cuadrante NO elegido solo suma en total (la otra opción de esa pregunta)
      // Como no tenemos acceso a la otra opción aquí, total refleja respuestas recibidas
    }

    const { error: resultsError } = await supabase.from("quadrant_results").insert({
      session_id: session.id,
      quad_a_selected: quadrantCounts.A.selected,
      quad_a_total: answers.length,
      quad_b_selected: quadrantCounts.B.selected,
      quad_b_total: answers.length,
      quad_c_selected: quadrantCounts.C.selected,
      quad_c_total: answers.length,
      quad_d_selected: quadrantCounts.D.selected,
      quad_d_total: answers.length,
    })

    if (resultsError) {
      console.error("[v0] Error guardando resultados por cuadrante:", resultsError)
      return NextResponse.json({ error: "Error al guardar resultados" }, { status: 500 })
    }

    return NextResponse.json({ success: true, sessionId: session.id })
  } catch (error) {
    console.error("[v0] Error inesperado en save-results:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
