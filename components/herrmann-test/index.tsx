"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
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

  // MINIJUEGOS

  const defaultQuestionsUntilActivity = 0; // Una actividad cada 6 preguntas
  const [questionsUntilActivity, setQuestionsUntilActivity] = useState(defaultQuestionsUntilActivity)

  const activitiesList = ['blocks', 'puzzle', 'image', 'ball', 'balloon', 'blocks']

  function getNextActivity() {
    return 0;
    if (currentIndex < 6) {
      return 0;
    } else if (currentIndex < 12) {
      return 1;
    } else if (currentIndex < 18) {
      return 2;
    } else if (currentIndex < 24) {
      return 3;
    } else if (currentIndex < 35) {
      return 4;
    } else {
      return -1;
    }
  }

  //

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
    if (!currentQuestion) return

    setSelectedOption(option)

    const quadrant = option === 'A'
      ? currentQuestion.optionA.quadrant
      : currentQuestion.optionB.quadrant

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id)
      return [...filtered, { questionId: currentQuestion.id, choice: option, quadrant }]
    })

    setQuestionsUntilActivity(questionsUntilActivity - 1)

    const activityShouldTrigger = questionsUntilActivity == 0 && getNextActivity() != -1

    if (activityShouldTrigger) {
      setShowActivity(true)
      setQuestionsUntilActivity(defaultQuestionsUntilActivity)
      return
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
      const nextQuestion = shuffledQuestions[currentIndex + 1]
      const existingAnswer = answers.find(a => a.questionId === nextQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
      setActivityCompleted(false)
      window.scrollTo({ top: 0 })
    } else {
      setTestCompleted(true)
    }
  }, [currentQuestion, currentIndex, totalQuestions, activityCompleted, shuffledQuestions, answers])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setShowActivity(false)
      setActivityCompleted(false)
      setCurrentIndex(prev => prev - 1)
      setQuestionsUntilActivity(questionsUntilActivity + 1)

      const prevQuestion = shuffledQuestions[currentIndex - 1]
      const existingAnswer = answers.find(a => a.questionId === prevQuestion?.id)
      setSelectedOption(existingAnswer?.choice || null)
      window.scrollTo({ top: 0 })
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
    setQuestionsUntilActivity(defaultQuestionsUntilActivity)

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
    setQuestionsUntilActivity(defaultQuestionsUntilActivity)
  }, [])

  if (!testStarted) {
    return <IntroScreen onStart={handleStart} />
  }

  if (testCompleted) {
    return <ResultsScreen nombre={nombre} apellido={apellido} answers={answers} onRestart={handleRestart} />
  }

  // Render an activity
  if (showActivity) {
    return (
      <ActivityWrapper
        activityType={activitiesList[getNextActivity()]}
        onComplete={handleActivityComplete}
        onSkip={handleSkipActivity}
      />
    )
  }

  return (
    <div className="pb-20">
      <div className="px-4 pt-6 md:pt-8 pb-4">
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
        className="fixed bottom-0 left-0 right-0 flex justify-center px-4 py-4"
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
      </motion.div>
    </div>
  )
}
