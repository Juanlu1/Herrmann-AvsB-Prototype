"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MusicMixer } from "./music-mixer"
import { DrawingCanvas } from "./drawing-canvas"
import { PuzzleGame } from "./puzzle-game"
import { RoomArranger } from "./room-arranger"
import { PackingGame } from "./packing-game"
import { MorningRoutine } from "./morning-routine"
import { TaskAssigner } from "./task-assigner"

interface ActivityWrapperProps {
  activityType: string
  selectedOption: 'A' | 'B'
  onComplete: () => void
  onSkip: () => void
}

export function ActivityWrapper({
  activityType,
  selectedOption,
  onComplete,
  onSkip
}: ActivityWrapperProps) {
  const renderActivity = () => {
    switch (activityType) {
      case 'music-mixer':
        return <MusicMixer selectedOption={selectedOption} onComplete={onComplete} />
      case 'drawing-canvas':
        return <DrawingCanvas onComplete={onComplete} />
      case 'puzzle':
        return <PuzzleGame onComplete={onComplete} />
      case 'room-arranger':
        return <RoomArranger selectedOption={selectedOption} onComplete={onComplete} />
      case 'packing':
        return <PackingGame selectedOption={selectedOption} onComplete={onComplete} />
      case 'morning-routine':
        return <MorningRoutine selectedOption={selectedOption} onComplete={onComplete} />
      case 'task-assigner':
        return <TaskAssigner selectedOption={selectedOption} onComplete={onComplete} />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-6 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Hora de una actividad!</h2>
          <p className="text-muted-foreground">Se puede completar u omitir</p>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg border border-border/50 mb-6">
          {renderActivity()}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onSkip}
            className="rounded-full px-8"
          >
            Omitir
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
