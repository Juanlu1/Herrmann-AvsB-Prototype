"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BlockGame } from "./block-game"
import { BallGame } from "./ball-game"
import { PuzzleGame } from "./puzzle-game"
import {BalloonGame} from "./balloon-game";
import { ImageGame } from "./image-game"

interface ActivityWrapperProps {
  activityType: string
  onComplete: () => void
  onSkip: () => void
}

export function ActivityWrapper({
  activityType,
  onComplete,
  onSkip
}: ActivityWrapperProps) {
  const renderActivity = () => {
    switch (activityType) {
      case 'blocks':
        return <BlockGame onComplete={onComplete} />
      case 'ball':
        return <BallGame onComplete={onComplete} />
      case 'puzzle':
        return <PuzzleGame onComplete={onComplete} />
      case 'balloon':
        return <BalloonGame onComplete={onComplete} />
      case 'image':
        return <ImageGame onComplete={onComplete} />
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
