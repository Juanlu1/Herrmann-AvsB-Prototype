"use client"

import { useState, useCallback } from "react"
import { IntroScreen } from "./intro-screen"
import { ExplainerScreen } from "./ExplainerScreen"
import { ResultsScreen } from "./results-screen"
import { ActivityWrapper } from "./activities"
import { TestEngine } from "./TestEngine"
import { questions, shuffleQuestions } from "@/lib/questions"
import type { Answer, Question } from "@/lib/herrmann-types"

type Phase = "intro" | "explainer" | "test" | "results"

export function HerrmannTest() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showActivity, setShowActivity] = useState(false)
  const [activityCompleted, setActivityCompleted] = useState(false)
  const [pendingOption, setPendingOption] = useState<"A" | "B" | null>(null)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")

  const currentQuestion = shuffledQuestions[currentIndex]
  const totalQuestions = shuffledQuestions.length

  const handleStart = useCallback((n: string, a: string) => {
    setNombre(n)
    setApellido(a)
    setShuffledQuestions(shuffleQuestions(questions))
    setCurrentIndex(0)
    setAnswers([])
    setPhase("explainer")
  }, [])

  const handleExplainerContinue = useCallback(() => {
    setPhase("test")
  }, [])

  const advanceTo = useCallback(
    (index: number, allAnswers: Answer[]) => {
      if (index < totalQuestions) {
        setCurrentIndex(index)
        setActivityCompleted(false)
        setShowActivity(false)
        setPendingOption(null)
      } else {
        setPhase("results")
      }
    },
    [totalQuestions],
  )

  const handleSelect = useCallback(
    (option: "A" | "B") => {
      if (!currentQuestion) return

      const quadrant = option === "A"
        ? currentQuestion.optionA.quadrant
        : currentQuestion.optionB.quadrant

      const newAnswers: Answer[] = [
        ...answers.filter(a => a.questionId !== currentQuestion.id),
        { questionId: currentQuestion.id, choice: option, quadrant },
      ]
      setAnswers(newAnswers)

      const activityShouldTrigger =
        currentQuestion.hasActivity &&
        !activityCompleted &&
        (!currentQuestion.activityOption || option === currentQuestion.activityOption)

      if (activityShouldTrigger) {
        setPendingOption(option)
        setShowActivity(true)
        return
      }

      advanceTo(currentIndex + 1, newAnswers)
    },
    [currentQuestion, answers, activityCompleted, currentIndex, advanceTo],
  )

  const handleActivityComplete = useCallback(() => {
    setActivityCompleted(true)
    setShowActivity(false)
    advanceTo(currentIndex + 1, answers)
  }, [currentIndex, answers, advanceTo])

  const handleSkipActivity = useCallback(() => {
    setShowActivity(false)
    setActivityCompleted(true)
    advanceTo(currentIndex + 1, answers)
  }, [currentIndex, answers, advanceTo])

  const handleRestart = useCallback(() => {
    setPhase("intro")
    setShuffledQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setShowActivity(false)
    setActivityCompleted(false)
    setPendingOption(null)
    setNombre("")
    setApellido("")
  }, [])

  if (phase === "intro") {
    return <IntroScreen onStart={handleStart} />
  }

  if (phase === "explainer") {
    return <ExplainerScreen onContinue={handleExplainerContinue} />
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        nombre={nombre}
        apellido={apellido}
        answers={answers}
        onRestart={handleRestart}
      />
    )
  }

  if (showActivity && currentQuestion?.hasActivity) {
    return (
      <ActivityWrapper
        activityType={currentQuestion.activityType!}
        selectedOption={pendingOption!}
        onComplete={handleActivityComplete}
        onSkip={handleSkipActivity}
      />
    )
  }

  return (
    <TestEngine
      questions={shuffledQuestions}
      currentIndex={currentIndex}
      onSelect={handleSelect}
    />
  )
}
