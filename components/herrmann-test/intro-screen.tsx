"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

interface IntroScreenProps {
  onStart: (nombre: string, apellido: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  const canStart = nombre.trim().length > 0 && apellido.trim().length > 0

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-6">

        {/* Badge decorativo */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Test de estilos
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
        >
          Estilos de
          <br />
          aprendizaje
        </motion.h1>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-card/80 backdrop-blur-md rounded-3xl border border-border/50 shadow-lg overflow-hidden"
        >
          <div className="p-7">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              En cada pregunta vas a elegir <strong>una de dos opciones</strong>.
              Ambas tienen un contexto que te ayuda a decidir.
            </p>
          </div>
          <div className="border-t border-border/40 bg-muted/30 px-7 py-4">
            <p className="text-sm text-muted-foreground italic">
              No hay respuestas correctas o incorrectas
            </p>
          </div>
        </motion.div>

        {/* Nombre y Apellido */}
        <motion.div variants={itemVariants} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="apellido" className="text-sm font-medium text-foreground">
                Apellido
              </Label>
              <Input
                id="apellido"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                placeholder="Tu apellido"
                className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Botón */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => onStart(nombre.trim(), apellido.trim())}
            disabled={!canStart}
            size="lg"
            className="text-base px-14 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            Comenzar
          </Button>
        </motion.div>

      </div>
    </motion.div>
  )
}
