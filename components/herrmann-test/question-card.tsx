"use client"

import { motion } from "framer-motion"
import { OptionCard } from "./option-card"
import type { Question } from "@/lib/herrmann-types"

interface QuestionCardProps {
  question: Question
  selectedOption: 'A' | 'B' | null
  onSelect: (option: 'A' | 'B') => void
  questionNumber: number
}

export function QuestionCard({
  question,
  selectedOption,
  onSelect,
  questionNumber
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Context */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <span className="text-sm text-muted-foreground mb-2 block">
          Pregunta {questionNumber}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground italic">
          {question.context}
        </h2>
      </motion.div>

      {/* Options */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-8">
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

        {/* "O" separator */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <div className="w-12 h-12 rounded-full bg-accent/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-border/30">
            <span className="text-lg font-bold text-accent-foreground">O</span>
          </div>
        </div>

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
      </div>
    </motion.div>
  )
}
