"use client"

import { NarrativeScreen, UltraFastScreen, ComparativeScreen } from "./screen-types"
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
  const screenType = question.screenType || 'narrative'

  switch (screenType) {
    case 'ultra-fast':
      return (
        <UltraFastScreen
          question={question}
          selectedOption={selectedOption}
          onSelect={onSelect}
          questionNumber={questionNumber}
        />
      )
    case 'comparative':
      return (
        <ComparativeScreen
          question={question}
          selectedOption={selectedOption}
          onSelect={onSelect}
          questionNumber={questionNumber}
        />
      )
    default:
      return (
        <NarrativeScreen
          question={question}
          selectedOption={selectedOption}
          onSelect={onSelect}
          questionNumber={questionNumber}
        />
      )
  }
}
