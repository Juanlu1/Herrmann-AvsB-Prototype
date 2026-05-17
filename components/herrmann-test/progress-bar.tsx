"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Progreso</span>
        <span className="text-sm font-bold text-primary">{current} de {total}</span>
      </div>
      <div className="h-3 bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
