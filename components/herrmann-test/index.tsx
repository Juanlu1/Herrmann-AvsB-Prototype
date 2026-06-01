"use client"

import { useState, useCallback } from "react"
import { IntroScreen } from "./intro-screen"
import { ExplainerScreen } from "./ExplainerScreen"
import { ResultsScreen } from "./results-screen"
import { ActivityWrapper } from "./activities"
import { TestEngine } from "./TestEngine"
import { questions, shuffleQuestions } from "@/lib/questions"
import type { Answer, Question } from "@/lib/herrmann-types"

import { ProgressSlide} from "@/components/herrmann-test/activities/loading"

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

  // MINIJUEGOS

  const defaultQuestionsUntilActivity = 5; // Una actividad cada 6 preguntas
  const [questionsUntilActivity, setQuestionsUntilActivity] = useState(defaultQuestionsUntilActivity)

  const activitiesList = ['puzzle', 'image', 'ball', 'balloon', 'blocks']

  function getNextActivity() {
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

    setQuestionsUntilActivity(questionsUntilActivity - 1)

    const activityShouldTrigger = questionsUntilActivity == 0 && getNextActivity() != -1

      if (activityShouldTrigger) {
        setPendingOption(option)
        setShowActivity(true)
        setQuestionsUntilActivity(defaultQuestionsUntilActivity)
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
    setQuestionsUntilActivity(defaultQuestionsUntilActivity)
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

  // Render an activity
  if (showActivity) {

    return (
        <ProgressSlide total={36} progreso={currentIndex} onComplete={handleActivityComplete} />
        /*
          <ActivityWrapper
          activityType={activitiesList[getNextActivity()]}
          onComplete={handleActivityComplete}
          onSkip={handleSkipActivity}
        />
        */
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
