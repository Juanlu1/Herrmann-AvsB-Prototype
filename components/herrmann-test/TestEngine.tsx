"use client"

import React, { useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SlideInteraction } from "./dynamics/SlideInteraction"
import { SplitInteraction } from "./dynamics/SplitInteraction"
import type { Question } from "@/lib/herrmann-types"

// ─── Registry ────────────────────────────────────────────────────────────────
const DYNAMICS = ["slide", "split"] as const
type DynamicKey = (typeof DYNAMICS)[number]

// Ahora solo necesitamos el tipo de dinámica, el tema es global
function pickDynamic(blockIndex: number): DynamicKey {
    return blockIndex % 2 === 0 ? "split" : "slide"
}

interface TestEngineProps {
    questions: Question[]
    currentIndex: number
    onSelect: (option: "A" | "B") => void
}

const BLOCK_SIZE = 6

export function TestEngine({ questions, currentIndex, onSelect }: TestEngineProps) {
    const blockIndex = Math.floor(currentIndex / BLOCK_SIZE)
    const dynamicMapRef = useRef<Map<number, DynamicKey>>(new Map())

    // Mantenemos la dinámica estable por bloque
    if (!dynamicMapRef.current.has(blockIndex)) {
        dynamicMapRef.current.set(blockIndex, pickDynamic(blockIndex))
    }
    const activeDynamic = dynamicMapRef.current.get(blockIndex)!

    const question = questions[currentIndex]
    const total = questions.length

    // Bloqueo de scroll para mobile (UX)
    useEffect(() => {
        if (typeof window === "undefined" || window.innerWidth >= 768) return
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = prevOverflow }
    }, [])

    if (!question) return null

    return (
        <div className="fixed inset-0 flex flex-col bg-background text-foreground font-sans overflow-hidden">
            {/* ── Progress bar ── */}
            <div className="relative z-10 px-7 pt-6 flex items-center gap-4">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={false}
                        animate={{ width: `${(currentIndex / total) * 100}%` }}
                        transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
                    />
                </div>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
            </div>

            {/* ── Active dynamic ── */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-6 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${question.id}-${activeDynamic}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        {activeDynamic === "slide" ? (
                            <SlideInteraction
                                question={question}
                                questionNumber={currentIndex + 1}
                                totalQuestions={total}
                                onSelect={onSelect}
                            />
                        ) : (
                            <SplitInteraction
                                question={question}
                                questionNumber={currentIndex + 1}
                                totalQuestions={total}
                                onSelect={onSelect}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    )
}