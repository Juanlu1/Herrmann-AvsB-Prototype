"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shuffle, Check, Sun } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

const activities = [
  { id: "ducha", name: "Ducharse", emoji: "🚿" },
  { id: "desayuno", name: "Desayunar", emoji: "🥐" },
  { id: "celular", name: "Ver el celular", emoji: "📱" },
  { id: "ejercicio", name: "Ejercicio", emoji: "🏃" },
  { id: "leer", name: "Leer", emoji: "📖" },
  { id: "musica", name: "Escuchar música", emoji: "🎵" },
]

function SortableActivity({ id, name, emoji }: { id: string; name: string; emoji: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

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
        "flex items-center gap-3 p-3 rounded-xl bg-secondary/80 border border-border/50 cursor-grab active:cursor-grabbing",
        isDragging && "shadow-lg opacity-90 z-10"
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-medium text-foreground">{name}</span>
    </div>
  )
}

interface MorningRoutineProps {
  selectedOption: 'A' | 'B'
  onComplete: () => void
}

export function MorningRoutine({ selectedOption, onComplete }: MorningRoutineProps) {
  const [items, setItems] = useState(activities)
  const [hasMixed, setHasMixed] = useState(false)
  const [hasOrdered, setHasOrdered] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      setHasOrdered(true)
    }
  }, [])

  const handleShuffle = useCallback(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    setItems(shuffled)
    setHasMixed(true)
  }, [items])

  const isOptionB = selectedOption === 'B'

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sun className="w-12 h-12 mx-auto mb-3 text-primary" />
        <h3 className="text-xl font-semibold mb-2">
          {isOptionB ? "Mezclá tu mañana" : "Armá tu rutina"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isOptionB 
            ? "Tocá mezclar para ver qué orden random te toca" 
            : "Ordená las actividades como las harías cada mañana"}
        </p>
      </div>

      {isOptionB ? (
        <div className="space-y-4">
          <div className="space-y-2 max-w-sm mx-auto">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/80 border border-border/50"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-medium text-foreground">{item.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={handleShuffle} variant="outline" size="lg" className="rounded-full">
              <Shuffle className="w-5 h-5 mr-2" />
              Mezclar
            </Button>
            {hasMixed && (
              <Button onClick={onComplete} size="lg" className="rounded-full bg-primary hover:bg-primary/90">
                <Check className="w-5 h-5 mr-2" />
                Listo
              </Button>
            )}
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-w-sm mx-auto">
              {items.map((item) => (
                <SortableActivity key={item.id} {...item} />
              ))}
            </div>
          </SortableContext>
          <div className="flex justify-center mt-6">
            <Button onClick={onComplete} size="lg" className="rounded-full bg-primary hover:bg-primary/90">
              <Check className="w-5 h-5 mr-2" />
              Listo
            </Button>
          </div>
        </DndContext>
      )}
    </div>
  )
}
