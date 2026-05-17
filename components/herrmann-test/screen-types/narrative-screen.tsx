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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      {/* Context: large, centered, breathes before options appear */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="text-center mb-3 md:mb-14"
      >
        <h2 className="text-2xl md:text-4xl font-semibold text-foreground italic leading-relaxed tracking-tight max-w-xl mx-auto text-balance">
          {question.context}
        </h2>
      </motion.div>

      {/* Options: staggered in slowly, one after the other */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          className="flex-1"
        >
          <OptionCard
            text={question.optionA.text}
            imageSrc={`/images/q${question.id}-a.jpg`}
            isSelected={selectedOption === 'A'}
            isOtherSelected={selectedOption === 'B'}
            onClick={() => onSelect('A')}
            label="A"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center py-2 md:py-0"
        >
          <div className="w-12 h-12 rounded-full bg-accent/60 flex items-center justify-center border border-border/30">
            <span className="text-base font-light text-accent-foreground/70">o</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
          className="flex-1"
        >
          <OptionCard
            text={question.optionB.text}
            imageSrc={`/images/q${question.id}-b.jpg`}
            isSelected={selectedOption === 'B'}
            isOtherSelected={selectedOption === 'A'}
            onClick={() => onSelect('B')}
            label="B"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
