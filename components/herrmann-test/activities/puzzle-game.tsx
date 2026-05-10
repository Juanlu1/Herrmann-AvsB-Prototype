"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const EMOJI_PAIRS = ["🐶","🐱","🦊","🐸","🦋","🍕","🌈","⭐"]

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildDeck(): Card[] {
  return shuffle([...EMOJI_PAIRS, ...EMOJI_PAIRS]).map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }))
}

interface PuzzleGameProps {
  onComplete: () => void
}

export function PuzzleGame({ onComplete }: PuzzleGameProps) {
  const [cards, setCards] = useState<Card[]>(buildDeck)
  const [selected, setSelected] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [solved, setSolved] = useState(false)

  const handleCard = useCallback((id: number) => {
    if (locked) return
    const card = cards.find(c => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return
    if (selected.includes(id)) return

    const newSelected = [...selected, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c))

    if (newSelected.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newSelected.map(sid => cards.find(c => c.id === sid)!)
      if (a.emoji === b.emoji) {
        setCards(prev => prev.map(c =>
          newSelected.includes(c.id) ? { ...c, isMatched: true } : c
        ))
        setSelected([])
        setLocked(false)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newSelected.includes(c.id) ? { ...c, isFlipped: false } : c
          ))
          setSelected([])
          setLocked(false)
        }, 900)
      }
    } else {
      setSelected(newSelected)
    }
  }, [cards, selected, locked])

  useEffect(() => {
    if (cards.length && cards.every(c => c.isMatched)) setSolved(true)
  }, [cards])

  const reset = useCallback(() => {
    setCards(buildDeck())
    setSelected([])
    setLocked(false)
    setMoves(0)
    setSolved(false)
  }, [])

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">Encontrá los pares</h3>
        <p className="text-sm text-muted-foreground">Tocá dos cartas para encontrar emojis iguales</p>
      </div>

      <div className="flex items-center justify-between px-1 max-w-xs mx-auto">
        <span className="text-xs text-muted-foreground">
          Movimientos: <span className="font-semibold text-foreground">{moves}</span>
        </span>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-3 h-3" /> Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => handleCard(card.id)}
            whileTap={{ scale: 0.92 }}
            className="aspect-square"
          >
            <div className="relative w-full h-full" style={{ perspective: 600 }}>
              <motion.div
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" as const }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full h-full"
              >
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl bg-primary/80 flex items-center justify-center shadow-sm border border-primary/40"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-xl">❓</span>
                </div>
                {/* Front */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl flex items-center justify-center shadow-sm border",
                    card.isMatched
                      ? "bg-green-500/20 border-green-500/50"
                      : "bg-card border-border/50"
                  )}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="text-2xl">{card.emoji}</span>
                </div>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-3"
          >
            <p className="text-base font-semibold text-primary">
              🎉 Lo encontraste todo en {moves} movimientos!
            </p>
            <Button onClick={onComplete} size="lg" className="rounded-full gap-2">
              <Check className="w-4 h-4" /> Listo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}