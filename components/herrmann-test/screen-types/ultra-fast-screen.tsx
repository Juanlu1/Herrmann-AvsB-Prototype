"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Question } from "@/lib/herrmann-types"

interface UltraFastScreenProps {
  question: Question
  selectedOption: 'A' | 'B' | null
  onSelect: (option: 'A' | 'B') => void
  questionNumber: number
}

export function UltraFastScreen({
  question,
  selectedOption,
  onSelect,
  questionNumber
}: UltraFastScreenProps) {
  return (
    <motion.div
      key={question.id}
      // Snaps in instantly — no slide, no slow fade
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto px-4"
    >
      {/* Question: small, plain, no ceremony */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.15 }}
        className="text-center text-base font-medium text-foreground mb-6"
      >
        {question.context}
      </motion.p>

      {/* Two tall tappable strips — stacked vertically on all sizes */}
      <div className="flex flex-col gap-3">
        {(["A", "B"] as const).map((opt, i) => {
          const isThis = selectedOption === opt
          const isOther = selectedOption === (opt === "A" ? "B" : "A")
          const option = opt === "A" ? question.optionA : question.optionB
          return (
            <motion.button
              key={opt}
              initial={{ opacity: 0, x: i === 0 ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.15 }}
              whileHover={!selectedOption ? { x: 4 } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(opt)}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3 rounded-2xl",
                "border-2 transition-all duration-150 cursor-pointer text-left",
                "bg-card/80 backdrop-blur-sm",
                isThis && "border-primary shadow-md shadow-primary/20 ring-1 ring-primary/20",
                !selectedOption && "border-border/40 hover:border-primary/50 hover:shadow-md",
                isOther && "opacity-30 border-border/20"
              )}
            >
              {/* Thumbnail — small, on the left */}
              <div className={cn(
                "relative shrink-0 rounded-xl overflow-hidden bg-transparent",
                "w-16 h-16"
              )}>
                <Image
                  src={`/images/q${question.id}-${opt.toLowerCase()}.jpg`}
                  alt={option.text}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Text */}
              <p className={cn(
                "text-sm leading-snug flex-1",
                isThis ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {option.text}
              </p>

              {/* Label pill — right side */}
              <span className={cn(
                "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                isThis
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}>
                {opt}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
