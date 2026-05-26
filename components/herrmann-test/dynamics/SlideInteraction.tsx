"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import type { Question } from "@/lib/herrmann-types"

interface SlideInteractionProps {
    question: Question
    questionNumber: number
    totalQuestions: number
    onSelect: (option: "A" | "B") => void
}

const THRESHOLD = 80

export function SlideInteraction({ question, onSelect }: SlideInteractionProps) {
    const y = useMotionValue(0)
    const [target, setTarget] = useState<"A" | "B" | null>(null)
    const [leaving, setLeaving] = useState<"A" | "B" | null>(null)

    const cardOpacity = useTransform(y, [-THRESHOLD * 2, 0, THRESHOLD * 2], [0.35, 1, 0.35])

    const commit = useCallback(
        (choice: "A" | "B") => {
            if (leaving) return
            setLeaving(choice)
            const targetY = choice === "A" ? -700 : 700
            animate(y, targetY, { duration: 0.36, ease: "easeIn" }).then(() => {
                onSelect(choice)
            })
        },
        [leaving, y, onSelect]
    )

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (leaving) return
            if (e.key === "ArrowUp") { e.preventDefault(); commit("A") }
            if (e.key === "ArrowDown") { e.preventDefault(); commit("B") }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [commit, leaving])

    const renderOption = (side: "A" | "B", text: string) => {
        const isTarget = target === side
        const isA = side === "A"

        return (
            <button
                onClick={() => commit(side)}
                disabled={!!leaving}
                className={`
          relative flex items-center justify-center p-6 min-h-24 rounded-[28px] font-sans
          text-xl md:text-2xl leading-tight text-center transition-all duration-300 select-none
          border-2 appearance-none cursor-pointer
          ${isTarget
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]'
                    : 'bg-card border-border text-foreground shadow-sm hover:border-primary/40'}
          ${leaving && leaving !== side ? 'opacity-0 scale-95' : 'opacity-100'}
        `}
            >
                <span className="flex-1">{text}</span>
            </button>
        )
    }

    return (
        <div className="relative w-full max-w-2xl h-full max-h-180 flex flex-col items-stretch justify-between gap-5 select-none font-sans">

            {/* Option A — Above */}
            {renderOption("A", question.optionA.text)}

            {/* Draggable Center Situation Card */}
            <motion.div
                drag="y"
                dragConstraints={{ top: -200, bottom: 200 }}
                dragElastic={0.4}
                onDrag={(_, info) => {
                    const dy = info.offset.y
                    if (dy < -40) setTarget("A")
                    else if (dy > 40) setTarget("B")
                    else setTarget(null)
                }}
                onDragEnd={(_, info) => {
                    const dy = info.offset.y
                    const vy = info.velocity.y
                    const triggered = dy < -THRESHOLD || (vy < -500 && dy < -20) ? "A" : dy > THRESHOLD || (vy > 500 && dy > 20) ? "B" : null

                    if (triggered) commit(triggered)
                    else {
                        animate(y, 0, { type: "spring", stiffness: 300, damping: 30 })
                        setTarget(null)
                    }
                }}
                style={{ y, opacity: cardOpacity }}
                className={`
          z-10 flex-1 flex flex-col items-center justify-center text-center p-10 rounded-4xl
          bg-card border-2 border-primary backdrop-blur-md shadow-none cursor-grab active:cursor-grabbing
          touch-none will-change-transform overflow-hidden
          ${leaving ? "pointer-events-none" : "pointer-events-auto"}
        `}
            >
                <div className="text-xs tracking-[0.22em] uppercase text-muted-foreground font-bold mb-4">
                    Situación
                </div>
                <div className="font-sans font-bold text-3xl md:text-5xl leading-[1.1] tracking-tight text-foreground">
                    {question.context}
                </div>

                {/* Help Indicator */}
                <div className="mt-6 text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                    <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↑</motion.span>
                    <span>arrastrá o tocá</span>
                    <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}>↓</motion.span>
                </div>
            </motion.div>

            {/* Option B — Below */}
            {renderOption("B", question.optionB.text)}

        </div>
    )
}