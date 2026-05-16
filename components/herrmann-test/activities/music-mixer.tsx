"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Shuffle } from "lucide-react"
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

const GENRES = [
  { id: "reggaeton",  name: "Reggaetón",  emoji: "🎤" },
  { id: "rock",       name: "Rock",        emoji: "🎸" },
  { id: "trap",       name: "Trap",        emoji: "🔥" },
  { id: "cumbia",     name: "Cumbia",      emoji: "💃" },
  { id: "jazz",       name: "Jazz",        emoji: "🎷" },
  { id: "electronica",name: "Electrónica", emoji: "🎧" },
]

const MEDAL = ["🥇", "🥈", "🥉"]

function RankItem({ id, name, emoji, rank }: { id: string; name: string; emoji: string; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border cursor-grab active:cursor-grabbing transition-all select-none",
        isDragging
          ? "shadow-xl bg-card border-primary/60 z-50 scale-[1.02]"
          : "bg-card/80 border-border/50 hover:border-primary/30 hover:shadow-sm"
      )}
    >
      {/* Position */}
      <div className="w-8 text-center shrink-0">
        {rank < 3 ? (
          <span className="text-xl">{MEDAL[rank]}</span>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{rank + 1}</span>
        )}
      </div>

      {/* Drag handle visual */}
      <div className="flex flex-col gap-0.5 shrink-0 opacity-30">
        {[0,1,2].map(i => (
          <div key={i} className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-foreground" />
            <div className="w-1 h-1 rounded-full bg-foreground" />
          </div>
        ))}
      </div>

      <span className="text-2xl">{emoji}</span>
      <span className="font-semibold text-foreground flex-1">{name}</span>

    </div>
  )
}

interface MusicMixerProps {
  selectedOption: "A" | "B"
  onComplete: () => void
}

export function MusicMixer({ onComplete }: MusicMixerProps) {
  const [items, setItems] = useState(GENRES)
  const [hasMixed, setHasMixed] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => i.id === active.id)
        const newIndex = prev.findIndex(i => i.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
      setHasMixed(true)
    }
  }, [])

  const shuffle = useCallback(() => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5))
    setHasMixed(true)
  }, [])

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">
        </h3>
        <p className="text-sm text-muted-foreground">
        </p>
      </div>

      {/* Label */}
      <div className="flex items-center justify-between max-w-sm mx-auto px-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          🏆 Mi ranking
        </span>
      </div>

      {/* Ranking list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 max-w-sm mx-auto">
            {items.map((genre, index) => (
              <RankItem key={genre.id} {...genre} rank={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-center">
      </div>
    </div>
  )
}