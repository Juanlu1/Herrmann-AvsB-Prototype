"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Shuffle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const tasks = [
  { id: "investigar", name: "Investigar", emoji: "🔍" },
  { id: "diseñar", name: "Diseñar", emoji: "🎨" },
  { id: "escribir", name: "Escribir", emoji: "✍️" },
  { id: "presentar", name: "Presentar", emoji: "🎤" },
]

const teammates = [
  { id: "ana", name: "Ana", emoji: "👩" },
  { id: "carlos", name: "Carlos", emoji: "👨" },
  { id: "lucia", name: "Lucía", emoji: "👩‍🦰" },
  { id: "martin", name: "Martín", emoji: "🧑" },
]

interface TaskAssignerProps {
  selectedOption: "A" | "B"
  onComplete: () => void
}

export function TaskAssigner({ selectedOption, onComplete }: TaskAssignerProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const isOptionB = selectedOption === "B"
  const allAssigned = Object.keys(assignments).length === tasks.length

  const handleTaskClick = useCallback(
    (taskId: string) => {
      setSelectedTask((prev) => (prev === taskId ? null : taskId))
    },
    []
  )

  const handleTeammateClick = useCallback(
    (teammateId: string) => {
      if (!selectedTask) return
      setAssignments((prev) => ({ ...prev, [selectedTask]: teammateId }))
      setSelectedTask(null)
    },
    [selectedTask]
  )

  const handleRandomAssign = useCallback(() => {
    const shuffled = [...teammates].sort(() => Math.random() - 0.5)
    const next: Record<string, string> = {}
    tasks.forEach((task, i) => { next[task.id] = shuffled[i].id })
    setAssignments(next)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">
          {isOptionB ? "Asignación al azar" : "Asigná las tareas"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isOptionB
            ? "Tirá los dados y mirá cómo quedan los roles"
            : "Tocá una tarea → después un compañero para asignarla"}
        </p>
      </div>

      {isOptionB ? (
        /* ── OPTION B: Random ── */
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {tasks.map((task, i) => {
              const assignedTo = teammates.find((t) => t.id === assignments[task.id])
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border/50 bg-card/80 p-4 text-center space-y-2"
                >
                  <span className="text-2xl">{task.emoji}</span>
                  <p className="text-sm font-medium">{task.name}</p>

                  <div className="h-px bg-border/40 mx-2" />

                  <AnimatePresence mode="wait">
                    {assignedTo ? (
                      <motion.div
                        key={assignedTo.id}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <span className="text-xl">{assignedTo.emoji}</span>
                        <span className="text-xs font-semibold text-primary">
                          {assignedTo.name}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted-foreground/50 italic h-8 flex items-center justify-center"
                      >
                        sin asignar
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <div className="flex justify-center gap-3">
            <Button
              onClick={handleRandomAssign}
              variant="outline"
              size="lg"
              className="rounded-full gap-2"
            >
              <Shuffle className="w-4 h-4" />
              {allAssigned ? "Volver a tirar" : "Tirar al azar"}
            </Button>
            <AnimatePresence>
              {allAssigned && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  <Button
                    onClick={onComplete}
                    size="lg"
                    className="rounded-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4" />
                    Listo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* ── OPTION A: Manual ── */
        <div className="space-y-5">
          {/* Side-by-side layout */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start">
            {/* Tasks column */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
                Tareas
              </p>
              {tasks.map((task) => {
                const assignedTo = teammates.find((t) => t.id === assignments[task.id])
                const isSelected = selectedTask === task.id

                return (
                  <motion.button
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-200",
                      isSelected &&
                        "border-primary bg-primary/10 shadow-[0_0_0_3px] shadow-primary/20",
                      !isSelected && assignedTo &&
                        "border-green-500/40 bg-green-500/5",
                      !isSelected && !assignedTo &&
                        "border-border/50 bg-card/80 hover:border-primary/40"
                    )}
                  >
                    <span className="text-xl shrink-0">{task.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{task.name}</p>
                      {assignedTo && (
                        <p className="text-xs text-muted-foreground truncate">
                          {assignedTo.name}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <motion.div
                        layoutId="selected-indicator"
                        className="ml-auto"
                        initial={false}
                      >
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Center divider */}
            <div className="flex flex-col items-center pt-10 gap-1 self-stretch">
              <div className="w-px flex-1 bg-border/40" />
            </div>

            {/* Teammates column */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-3">
                Compañeros
              </p>
              {teammates.map((teammate) => {
                const isAssigned = Object.values(assignments).includes(teammate.id)
                const canClick = !!selectedTask

                return (
                  <motion.button
                    key={teammate.id}
                    onClick={() => handleTeammateClick(teammate.id)}
                    disabled={!canClick}
                    whileTap={{ scale: canClick ? 0.96 : 1 }}
                    className={cn(
                      "w-full p-3 rounded-xl border flex items-center gap-3 transition-all duration-200",
                      canClick && !isAssigned &&
                        "border-border/50 bg-card/80 hover:border-primary/60 hover:bg-primary/5 cursor-pointer",
                      canClick && isAssigned &&
                        "border-green-500/40 bg-green-500/5 cursor-pointer hover:border-primary/60",
                      !canClick &&
                        "border-border/30 bg-card/40 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span className="text-xl">{teammate.emoji}</span>
                    <p className="text-sm font-medium">{teammate.name}</p>
                    {isAssigned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Progress + Done */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">
              {Object.keys(assignments).length}/{tasks.length} asignadas
            </p>
            <AnimatePresence>
              {allAssigned && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    onClick={onComplete}
                    size="sm"
                    className="rounded-full gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4" />
                    Listo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}