"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import type { Answer } from "@/lib/herrmann-types"

interface ResultsScreenProps {
  nombre: string
  apellido: string
  answers: Answer[]
  onRestart: () => void
}

export function ResultsScreen({ nombre, apellido, answers, onRestart }: ResultsScreenProps) {
  const saved = useRef(false)

  useEffect(() => {
    if (saved.current) return
    saved.current = true
    fetch('/api/save-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, answers }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.error('[v0] Error guardando resultados:', res.status, data)
        }
      })
      .catch((err) => console.error('[v0] Error de red al guardar resultados:', err))
  }, [nombre, apellido, answers])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-6">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <CheckCircle2 className="w-20 h-20 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            ¡Listo{nombre ? `, ${nombre}` : ""}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Completaste el test de estilos de aprendizaje.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-card/80 backdrop-blur-md rounded-3xl border border-border/50 shadow-lg p-6"
        >
          <p className="text-base text-foreground leading-relaxed">
            Gracias por participar, <strong>{nombre} {apellido}</strong>. Tus respuestas fueron registradas correctamente.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Button
            onClick={onRestart}
            size="lg"
            className="px-10 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Volver a empezar
          </Button>
        </motion.div>

      </div>
    </motion.div>
  )
}
