"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Context centered above the vs layout */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center mb-3 md:mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground max-w-2xl mx-auto text-balance">
          {question.context}
        </h2>
      </motion.div>

      {/* Two full-height panels separated by a hard vertical divider */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 items-stretch">

        {/* Left panel — slides in from left */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
          whileHover={!selectedOption ? { x: 6 } : {}}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect('A')}
          className={cn(
            "relative flex flex-col gap-2 p-3 md:gap-4 md:p-6 rounded-3xl md:rounded-r-none md:rounded-l-3xl",
            "border-2 transition-all duration-250 cursor-pointer text-left",
            "bg-card/80 backdrop-blur-sm",
            selectedOption === 'A' && "border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/15",
            !selectedOption && "border-border/40 hover:border-primary/40 hover:shadow-lg",
            selectedOption === 'B' && "opacity-30 border-border/20"
          )}
        >
          <span className={cn(
            "self-start px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
            selectedOption === 'A'
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          )}>
            Opción A
          </span>

          <div className="relative w-full h-24 md:aspect-video md:h-auto rounded-2xl overflow-hidden bg-transparent">
            <Image
              src={`/images/q${question.id}-a.jpg`}
              alt={question.optionA.text}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>

          <p className={cn(
            "text-sm md:text-base leading-relaxed text-center",
            selectedOption === 'A' ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {question.optionA.text}
          </p>
        </motion.button>

        {/* Vertical divider with VS label */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
          className="hidden md:flex flex-col items-center justify-center px-3 gap-3"
        >
          <div className="w-px flex-1 bg-border/60" />
          <span className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase select-none">
            VS
          </span>
          <div className="w-px flex-1 bg-border/60" />
        </motion.div>

        {/* Mobile divider */}
        <div className="md:hidden flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase select-none">VS</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        {/* Right panel — slides in from right */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
          whileHover={!selectedOption ? { x: -6 } : {}}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect('B')}
          className={cn(
            "relative flex flex-col gap-2 p-3 md:gap-4 md:p-6 rounded-3xl md:rounded-l-none md:rounded-r-3xl",
            "border-2 transition-all duration-250 cursor-pointer text-left",
            "bg-card/80 backdrop-blur-sm",
            selectedOption === 'B' && "border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/15",
            !selectedOption && "border-border/40 hover:border-primary/40 hover:shadow-lg",
            selectedOption === 'A' && "opacity-30 border-border/20"
          )}
        >
          <span className={cn(
            "self-start px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
            selectedOption === 'B'
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          )}>
            Opción B
          </span>

          <div className="relative w-full h-24 md:aspect-video md:h-auto rounded-2xl overflow-hidden bg-transparent">
            <Image
              src={`/images/q${question.id}-b.jpg`}
              alt={question.optionB.text}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>

          <p className={cn(
            "text-sm md:text-base leading-relaxed text-center",
            selectedOption === 'B' ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {question.optionB.text}
          </p>
        </motion.button>
      </div>
    </motion.div>
  )
}
