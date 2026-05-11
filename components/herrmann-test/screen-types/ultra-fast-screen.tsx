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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Compact question header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="text-center mb-6"
      >
        <span className="text-xs text-muted-foreground mb-2 block">
          {questionNumber}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          {question.context}
        </h2>
      </motion.div>

      {/* Fast-paced option cards in compact layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.08, delayChildren: 0.1 }}
        className="grid grid-cols-2 gap-3 md:gap-4"
      >
        {/* Option A - Compact card */}
        <motion.button
          key="option-a"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: selectedOption === 'B' ? 1 : 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('A')}
          className={cn(
            "relative flex flex-col items-center p-3 md:p-4 rounded-2xl transition-all duration-200 cursor-pointer",
            "bg-card/70 backdrop-blur-sm border-2 shadow-md",
            selectedOption === 'A' && "border-primary shadow-primary/25 shadow-lg ring-2 ring-primary/20",
            !selectedOption && !selectedOption && "border-border/40 hover:border-primary/40",
            selectedOption === 'B' && "opacity-35 border-border/20"
          )}
        >
          <span className={cn(
            "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            selectedOption === 'A' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            A
          </span>

          <div className="relative w-full aspect-square max-w-[120px] mb-2 rounded-xl overflow-hidden bg-secondary/50">
            <Image
              src={`/images/q${question.id}-a.jpg`}
              alt={question.optionA.text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 35vw, 120px"
            />
          </div>

          <p className={cn(
            "text-xs md:text-sm text-center leading-tight",
            selectedOption === 'A' ? "text-foreground font-medium" : "text-muted-foreground/80"
          )}>
            {question.optionA.text}
          </p>
        </motion.button>

        {/* Option B - Compact card */}
        <motion.button
          key="option-b"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08 }}
          whileHover={{ scale: selectedOption === 'A' ? 1 : 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('B')}
          className={cn(
            "relative flex flex-col items-center p-3 md:p-4 rounded-2xl transition-all duration-200 cursor-pointer",
            "bg-card/70 backdrop-blur-sm border-2 shadow-md",
            selectedOption === 'B' && "border-primary shadow-primary/25 shadow-lg ring-2 ring-primary/20",
            !selectedOption && "border-border/40 hover:border-primary/40",
            selectedOption === 'A' && "opacity-35 border-border/20"
          )}
        >
          <span className={cn(
            "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
            selectedOption === 'B' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            B
          </span>

          <div className="relative w-full aspect-square max-w-[120px] mb-2 rounded-xl overflow-hidden bg-secondary/50">
            <Image
              src={`/images/q${question.id}-b.jpg`}
              alt={question.optionB.text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 35vw, 120px"
            />
          </div>

          <p className={cn(
            "text-xs md:text-sm text-center leading-tight",
            selectedOption === 'B' ? "text-foreground font-medium" : "text-muted-foreground/80"
          )}>
            {question.optionB.text}
          </p>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
