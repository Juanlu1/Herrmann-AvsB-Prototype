"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { IntroScreen } from "./intro-screen"
import { ProgressBar } from "./progress-bar"
import { QuestionCard } from "./question-card"
import { ResultsScreen } from "./results-screen"
import { ActivityWrapper } from "./activities"
import { questions, shuffleQuestions } from "@/lib/questions"
import type { Answer, Question } from "@/lib/herrmann-types"

export function HerrmannTest() {
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showActivity, setShowActivity] = useState(false)
  const [activityCompleted, setActivityCompleted] = useState(false)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  const currentQuestion = shuffledQuestions[currentIndex]
  const totalQuestions = shuffledQuestions.length

  const handleStart = useCallback((n: string, a: string) => {
    setNombre(n)
    setApellido(a)
    setShuffledQuestions(shuffleQuestions(questions))
    setTestStarted(true)
    setCurrentIndex(0)
    setAnswers([])
  }, [])

  const handleSelect = useCallback((option: 'A' | 'B') => {
    setSelectedOption(option)
  }, [])

  const handleNext = useCallback(() => {
    if (!selectedOption || !currentQuestion) return

    const quadrant = selectedOption === 'A'
      ? currentQuestion.optionA.quadrant
      : currentQuestion.optionB.quadrant

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id)
      return [...filtered, { questionId: currentQuestion.id, choice: selectedOption, quadrant }]
    })

    const activityShouldTrigger = currentQuestion.hasActivity &&
      !activityCompleted &&
      (!currentQuestion.activityOption || selectedOption === currentQuestion.activityOption)

    if (activityShouldTrigger) {
      setShowActivity(true)
      return
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      const nextQuestion = shuffledQuestions[currentIndex + 1]
      const existingAnswer = answers.find(a => a.questionId === nextQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
      setActivityCompleted(false)
    } else {
      setTestCompleted(true)
    }
  }, [selectedOption, currentQuestion, currentIndex, totalQuestions, activityCompleted, shuffledQuestions, answers])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setShowActivity(false)
      setActivityCompleted(false)
      setCurrentIndex(prev => prev - 1)

      const prevQuestion = shuffledQuestions[currentIndex - 1]
      const existingAnswer = answers.find(a => a.questionId === prevQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
    }
  }, [currentIndex, shuffledQuestions, answers])

  const handleActivityComplete = useCallback(() => {
    setActivityCompleted(true)
    setShowActivity(false)

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      const nextQuestion = shuffledQuestions[currentIndex + 1]
      const existingAnswer = answers.find(a => a.questionId === nextQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
      setActivityCompleted(false)
    } else {
      setTestCompleted(true)
    }
  }, [currentIndex, totalQuestions, shuffledQuestions, answers])

  const handleSkipActivity = useCallback(() => {
    setShowActivity(false)
    setActivityCompleted(true)

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      const nextQuestion = shuffledQuestions[currentIndex + 1]
      const existingAnswer = answers.find(a => a.questionId === nextQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
      setActivityCompleted(false)
    } else {
      setTestCompleted(true)
    }
  }, [currentIndex, totalQuestions, shuffledQuestions, answers])

  const handleRestart = useCallback(() => {
    setTestStarted(false)
    setTestCompleted(false)
    setShuffledQuestions([])
    setCurrentIndex(0)
    setSelectedOption(null)
    setAnswers([])
    setShowActivity(false)
    setActivityCompleted(false)
    setNombre("")
    setApellido("")
  }, [])

  if (!testStarted) {
    return <IntroScreen onStart={handleStart} />
  }

  if (testCompleted) {
    return <ResultsScreen nombre={nombre} apellido={apellido} answers={answers} onRestart={handleRestart} />
  }

  if (showActivity && currentQuestion?.hasActivity) {
    return (
      <ActivityWrapper
        activityType={currentQuestion.activityType!}
        selectedOption={selectedOption!}
        onComplete={handleActivityComplete}
        onSkip={handleSkipActivity}
      />
    )
  }

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="px-4 mb-8">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion?.id}
          question={currentQuestion}
          selectedOption={selectedOption}
          onSelect={handleSelect}
          questionNumber={currentIndex + 1}
        />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mt-8 px-4"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="rounded-full px-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Anterior
        </Button>

        <Button
          size="lg"
          onClick={handleNext}
          disabled={!selectedOption}
          className="rounded-full px-6 bg-primary hover:bg-primary/90"
        >
          Siguiente
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </div>
  )
}
