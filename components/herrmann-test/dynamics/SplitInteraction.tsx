"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { Question } from "@/lib/herrmann-types"

interface SplitInteractionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onSelect: (option: "A" | "B") => void
}

const COMMIT_MS = 320

export function SplitInteraction({
                                   question,
                                   onSelect,
                                 }: SplitInteractionProps) {
  const [target, setTarget] = useState<"A" | "B" | null>(null)
  const [leaving, setLeaving] = useState<"A" | "B" | null>(null)
  const committedRef = useRef(false)

  const commit = useCallback(
      (choice: "A" | "B") => {
        if (committedRef.current) return
        committedRef.current = true
        setLeaving(choice)
        setTarget(choice)
        setTimeout(() => onSelect(choice), COMMIT_MS)
      },
      [onSelect],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (committedRef.current) return
      if (e.key === "ArrowLeft") { e.preventDefault(); commit("A") }
      if (e.key === "ArrowRight") { e.preventDefault(); commit("B") }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [commit])

  const isLeaving = leaving !== null

  // Helper para las clases dinámicas de las mitades
    const getCardClasses = (side: "A" | "B") => {
        const isTarget = target === side;
        const isOther = target !== null && target !== side;
        const isChosen = leaving === side;
        const isRejected = leaving !== null && leaving !== side;
        const anyChosen = leaving !== null; // ¿Ya se tomó una decisión?

        let stateClasses = "bg-card border-primary shadow-sm";

        if (isTarget) stateClasses += "shadow-md scale-[1.012]";
        if (isChosen) stateClasses += "shadow-lg scale-[1.025] z-20";

        if (isRejected) stateClasses += "opacity-0 scale-95 pointer-events-none transition-all duration-300";
        if (isOther) stateClasses += " opacity-40";

        const mobileBorders = !anyChosen
            ? (side === "A" ? "border-b-1" : "border-t-1")
            : "border-2";

        return `w-full h-full p-6 md:p-9 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 overflow-hidden border-2 ${mobileBorders} md:border-2 ${stateClasses}`;
    };

  const renderOption = (side: "A" | "B", optionText: string) => {
    const isA = side === "A";

    return (
        <button
            className={`p-0 m-0 bg-transparent flex items-stretch min-h-0 w-full transition-cursor duration-200 ${isLeaving ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ gridArea: isA ? "a" : "b" }}
            onPointerEnter={() => !committedRef.current && setTarget(side)}
            onPointerLeave={() => !committedRef.current && setTarget(t => t === side ? null : t)}
            onClick={() => commit(side)}
            aria-label={`Elegir ${side}: ${optionText}`}
        >
          <div className={`
        ${getCardClasses(side)} 
        ${isA ? 'rounded-t-[20px]' : 'rounded-b-[20px]'} 
        md:rounded-[28px]
      `}>
            {/* Label (A o B) */}
            <div className="flex-none w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold tracking-widest border border-border/50">
              {side}
            </div>

            {/* Texto de la opción - Unificado */}
            <div className="text-xl md:text-2xl leading-tight tracking-tight text-foreground max-w-md">
              {optionText}
            </div>
          </div>
        </button>
    );
  };

  return (
      <motion.div
          key={question.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-full grid select-none split-stage-grid"
      >
        {/* Option A */}
        {renderOption("A", question.optionA.text)}

        {/* Context Pill */}
        <div className="split-ctx-wrapper ">
          <div className="text-center px-6 py-4 rounded-2xl bg-card border-2 border-primary backdrop-blur-md w-full max-w-lg shadow-none">
            <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground font-bold mb-1.5">
              Situación
            </div>
            <div className="font-sans font-bold text-lg md:text-xl leading-tight text-foreground">
              {question.context}
            </div>
          </div>
        </div>

        {/* Option B */}
        {renderOption("B", question.optionB.text)}

        <style>{`
        .split-stage-grid {
          grid-template-areas: "a" "b";
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1fr;
          gap: 0;
        }

        .split-ctx-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 30;
          display: flex;
          justify-content: center;
          width: 88%;
          pointer-events-auto!;
          select-none;
        }

        @media (min-width: 720px) {
          .split-stage-grid {
            grid-template-areas: "ctx ctx" "a b";
            grid-template-rows: auto 1fr;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .split-ctx-wrapper {
            position: static;
            transform: none;
            grid-area: ctx;
            pointer-events: auto;
          }
        }
      `}</style>
      </motion.div>
  )
}