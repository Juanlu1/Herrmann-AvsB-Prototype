"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ExplainerScreenProps {
  onContinue: () => void
}

export function ExplainerScreen({ onContinue }: ExplainerScreenProps) {
  const [demoSplit, setDemoSplit] = useState<"A" | "B">("A")

  useEffect(() => {
    const id = setInterval(() => setDemoSplit(s => (s === "A" ? "B" : "A")), 1600)
    return () => clearInterval(id)
  }, [])

  return (
      <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-center min-h-screen px-4 py-8 font-sans"
      >
        {/* Main Card */}
        <div className="w-full max-w-(--size-3xl) p-6 md:p-10 rounded-xl bg-card/80 border border-border backdrop-blur-xl shadow-2xl text-foreground">

          {/* Eyebrow / Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs tracking-widest uppercase font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Cómo funciona
          </div>

          {/* Title - Usando Merriweather para elegancia académica */}
          <h1 className="font-serif font-bold text-3xl md:text-5xl leading-tight tracking-tight text-foreground mb-4">
            Dos formas de elegir<br />a lo largo del test
          </h1>

          {/* Lede */}
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
            El test va a alternar entre estas dos dinámicas. Cada bloque cambia de atmósfera
            y de forma de responder — es la misma decisión, presentada distinto.
          </p>

          {/* Demo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 md:my-8">

            {/* Slide demo Card */}
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-lg uppercase tracking-tight">Slide</span>
                <span className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-background/50 border border-border text-muted-foreground">Vertical</span>
              </div>
              <div className="relative h-32 rounded-(--radius-md) bg-background/50 flex items-center justify-center overflow-hidden">
                <div className="w-3/4 flex flex-col gap-2">
                  <div className="h-6 rounded-sm bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground uppercase font-bold">opción A</div>
                  <div className="h-10 rounded-sm bg-linear-to-br from-primary/20 to-accent/20 border border-primary/40 flex items-center justify-center text-primary text-[10px] font-black uppercase animate-bounce">situación</div>
                  <div className="h-6 rounded-sm bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground uppercase font-bold">opción B</div>
                </div>
              </div>
            </div>

            {/* Split demo Card */}
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-lg uppercase tracking-tight">Split</span>
                <span className="text-[10px] tracking-widest uppercase px-2 py-1 rounded-full bg-background/50 border border-border text-muted-foreground">Horizontal</span>
              </div>
              <div className="relative h-32 rounded-(--radius-md) bg-background/50 flex items-center justify-center p-4">
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  <div className={`rounded-sm border flex items-center justify-center text-[10px] font-bold transition-all ${demoSplit === "A" ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`}>Opción A</div>
                  <div className={`rounded-sm border flex items-center justify-center text-[10px] font-bold transition-all ${demoSplit === "B" ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}`}>Opción B</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <span className="text-xs md:text-sm text-muted-foreground text-center md:text-left max-w-xs">
            No hay respuestas correctas. Elegí lo primero que se te venga a la mente.
          </span>
            <button
                onClick={onContinue}
                className="w-full md:w-auto px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Empezar
            </button>
          </div>
        </div>
      </motion.div>
  )
}