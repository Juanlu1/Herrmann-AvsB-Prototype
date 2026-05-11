"use client"

import { motion } from "framer-motion"
import { OptionCard } from "../option-card"
import type { Question } from "@/lib/herrmann-types"

interface ComparativeScreenProps {
  question: Question
  selectedOption: 'A' | 'B' | null
  onSelect: (option: 'A' | 'B') => void
  questionNumber: number
}

export function ComparativeScreen({
  question,
  selectedOption,
  onSelect,
  questionNumber
}: ComparativeScreenProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Question header with comparison framing */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="text-center mb-10"
      >
        <span className="text-sm text-muted-foreground/60 mb-3 block">
          Pregunta {questionNumber} · Comparativa
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground max-w-3xl mx-auto">
          {question.context}
        </h2>
      </motion.div>

      {/* Side-by-side comparison layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch"
      >
        {/* Left card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col"
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

        {/* Right card */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col"
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
      </motion.div>

      {/* Subtle comparison prompt */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs md:text-sm text-muted-foreground/50 mt-8 italic"
      >
        ¿Cuál te resuena más?
      </motion.p>
    </motion.div>
  )
}
