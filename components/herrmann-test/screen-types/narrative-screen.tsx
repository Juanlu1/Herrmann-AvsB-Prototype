"use client"

import { motion } from "framer-motion"
import { OptionCard } from "../option-card"
import type { Question } from "@/lib/herrmann-types"

interface NarrativeScreenProps {
  question: Question
  selectedOption: 'A' | 'B' | null
  onSelect: (option: 'A' | 'B') => void
  questionNumber: number
}

export function NarrativeScreen({
  question,
  selectedOption,
  onSelect,
  questionNumber
}: NarrativeScreenProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Immersive context section with larger spacing */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-center mb-12 md:mb-16"
      >
        <span className="text-xs md:text-sm text-muted-foreground/70 mb-4 block uppercase tracking-widest">
          Pregunta {questionNumber}
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground italic leading-relaxed max-w-2xl mx-auto">
          {question.context}
        </h2>
      </motion.div>

      {/* Options with reflective spacing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8"
      >
        <div className="flex-1">
          <OptionCard
            text={question.optionA.text}
            imageSrc={`/images/q${question.id}-a.jpg`}
            isSelected={selectedOption === 'A'}
            isOtherSelected={selectedOption === 'B'}
            onClick={() => onSelect('A')}
            label="A"
          />
        </div>

        {/* "O" separator with atmospheric styling */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="flex items-center justify-center py-4 md:py-0"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/60 to-accent/40 backdrop-blur-sm flex items-center justify-center shadow-xl border border-border/40">
            <span className="text-xl font-light text-accent-foreground/80">O</span>
          </div>
        </motion.div>

        <div className="flex-1">
          <OptionCard
            text={question.optionB.text}
            imageSrc={`/images/q${question.id}-b.jpg`}
            isSelected={selectedOption === 'B'}
            isOtherSelected={selectedOption === 'A'}
            onClick={() => onSelect('B')}
            label="B"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
