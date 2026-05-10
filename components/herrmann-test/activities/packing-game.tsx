"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_ITEMS = [
  { id: "ropa",        emoji: "👕", name: "Ropa" },
  { id: "cargador",    emoji: "🔌", name: "Cargador" },
  { id: "cepillo",     emoji: "🪥", name: "Cepillo" },
  { id: "auriculares", emoji: "🎧", name: "Auriculares" },
  { id: "billetera",   emoji: "💳", name: "Billetera" },
  { id: "llaves",      emoji: "🔑", name: "Llaves" },
]

interface PackingGameProps {
  selectedOption: "A" | "B"
  onComplete: () => void
}

export function PackingGame({ selectedOption, onComplete }: PackingGameProps) {
  const [packed, setPacked] = useState<string[]>([])
  const isOptionB = selectedOption === "B"

  const toggle = useCallback((id: string) => {
    if (isOptionB) {
      // solo agregar, no sacar (para que se tache en la lista)
      setPacked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    } else {
      setPacked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }
  }, [isOptionB])

  const canAdd = (id: string) => !packed.includes(id)
  const allPacked = ALL_ITEMS.every(i => packed.includes(i.id))

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">Armá tu mochila</h3>
        <p className="text-sm text-muted-foreground">
          {isOptionB
            ? "Metés solo lo de la lista — se tacha cuando lo ponés"
            : "Metés lo que quieras en la mochila"}
        </p>
      </div>

      {isOptionB ? (
        <div className="space-y-4">
          {/* Lista de iconos arriba */}
          <div className="flex flex-wrap justify-center gap-3 px-2">
            {ALL_ITEMS.map(item => {
              const done = packed.includes(item.id)
              return (
                <motion.div
                  key={item.id}
                  animate={{ opacity: done ? 0.35 : 1 }}
                  className="relative flex flex-col items-center gap-1"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all",
                    done
                      ? "bg-muted/40 border-border/30"
                      : "bg-card border-border/60"
                  )}>
                    {item.emoji}
                  </div>
                  {/* Tachado */}
                  {done && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-1/2 left-0 w-full h-0.5 bg-muted-foreground/60 rounded-full"
                      style={{ marginTop: -10 }}
                    />
                  )}
                  <span className={cn(
                    "text-[10px] font-medium",
                    done ? "text-muted-foreground/50 line-through" : "text-muted-foreground"
                  )}>
                    {item.name}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40 mx-4" />

          {/* Layout: items disponibles + mochila */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
            {/* Items para tocar */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Disponibles
              </p>
              {ALL_ITEMS.map(item => {
                const isPacked = packed.includes(item.id)
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => canAdd(item.id) && toggle(item.id)}
                    whileTap={{ scale: isPacked ? 1 : 0.95 }}
                    disabled={isPacked}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all",
                      isPacked
                        ? "opacity-30 border-border/20 bg-card/40 cursor-not-allowed"
                        : "bg-card/80 border-border/50 hover:border-primary/40 cursor-pointer"
                    )}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex flex-col items-center pt-8 self-stretch">
              <div className="w-px flex-1 bg-border/40" />
            </div>

            {/* Mochila */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                🎒 Mochila
              </p>
              <AnimatePresence>
                {packed.length === 0 ? (
                  <p className="text-xs text-muted-foreground/40 italic text-center py-4">
                    Vacía
                  </p>
                ) : (
                  packed.map(id => {
                    const item = ALL_ITEMS.find(i => i.id === id)!
                    return (
                      <motion.button
                        key={id}
                        onClick={() => toggle(id)}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm bg-primary/10 border-primary/40 text-primary"
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="font-medium flex-1 text-left">{item.name}</span>
                        <span className="text-xs text-primary/50">✕</span>
                      </motion.button>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Opción A: libre */
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              🏠 Disponibles
            </p>
            {ALL_ITEMS.map(item => {
              const isPacked = packed.includes(item.id)
              return (
                <motion.button
                  key={item.id}
                  onClick={() => !isPacked && toggle(item.id)}
                  whileTap={{ scale: isPacked ? 1 : 0.95 }}
                  disabled={isPacked}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all",
                    isPacked
                      ? "opacity-30 border-border/20 bg-card/40 cursor-not-allowed"
                      : "bg-card/80 border-border/50 hover:border-primary/40 cursor-pointer"
                  )}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="flex flex-col items-center pt-8 self-stretch">
            <div className="w-px flex-1 bg-border/40" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              🎒 Mi mochila
            </p>
            <AnimatePresence>
              {packed.length === 0 ? (
                <p className="text-xs text-muted-foreground/40 italic text-center py-4">
                  Tocá un ítem
                </p>
              ) : (
                packed.map(id => {
                  const item = ALL_ITEMS.find(i => i.id === id)!
                  return (
                    <motion.button
                      key={id}
                      onClick={() => toggle(id)}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm bg-primary/10 border-primary/40 text-primary"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span className="font-medium flex-1 text-left">{item.name}</span>
                      <span className="text-xs text-primary/50">✕</span>
                    </motion.button>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence>
        {(isOptionB ? allPacked : packed.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-2"
          >
            <Button onClick={onComplete} size="lg" className="rounded-full gap-2">
              <Check className="w-4 h-4" /> Listo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}