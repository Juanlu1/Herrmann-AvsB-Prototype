"use client"

import React, { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SlideInteraction } from "./dynamics/SlideInteraction"
import { SplitInteraction } from "./dynamics/SplitInteraction"
import type { Question } from "@/lib/herrmann-types"
import "./themes/aurora.css"
import "./themes/ethereal.css"

// ─── Registry ────────────────────────────────────────────────────────────────
// Adding a new dynamic: create component, import, add entry.
const DYNAMICS = ["slide", "split"] as const
type DynamicKey = (typeof DYNAMICS)[number]

// Adding a new theme: create CSS, import, add entry.
const THEMES = ["aurora", "ethereal"] as const
type ThemeKey = (typeof THEMES)[number]

type Combo = { dynamic: DynamicKey; theme: ThemeKey }

function pickCombo(blockIndex: number, previous: Combo | null): Combo {
  const allCombos: Combo[] = DYNAMICS.flatMap(d =>
    THEMES.map(t => ({ dynamic: d, theme: t })),
  )
  const available = previous
    ? allCombos.filter(c => !(c.dynamic === previous.dynamic && c.theme === previous.theme))
    : allCombos
  return available[Math.floor(Math.random() * available.length)]
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TestEngineProps {
  questions: Question[]
  currentIndex: number
  onSelect: (option: "A" | "B") => void
}

const BLOCK_SIZE = 6

// ─── Component ───────────────────────────────────────────────────────────────
export function TestEngine({ questions, currentIndex, onSelect }: TestEngineProps) {
  const blockIndex = Math.floor(currentIndex / BLOCK_SIZE)
  const comboMapRef = useRef<Map<number, Combo>>(new Map())
  const prevBlockRef = useRef(-1)

  // Stable combo per block
  if (!comboMapRef.current.has(blockIndex)) {
    const prev = blockIndex > 0 ? (comboMapRef.current.get(blockIndex - 1) ?? null) : null
    comboMapRef.current.set(blockIndex, pickCombo(blockIndex, prev))
  }
  const combo = comboMapRef.current.get(blockIndex)!

  const question = questions[currentIndex]
  const total = questions.length

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach(t => root.classList.remove(`theme-${t}`))
    root.classList.add(`theme-${combo.theme}`)
    return () => { root.classList.remove(`theme-${combo.theme}`) }
  }, [combo.theme])

  // Show transition banner when block changes
  useEffect(() => {
    prevBlockRef.current = blockIndex
  }, [blockIndex])

  if (!question) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--t-bg)",
        color: "var(--t-text-body)",
        fontFamily: "var(--t-font-body)",
        overflow: "hidden",
      }}
    >
      {/* ── Background stack ── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
      >
        <div className="bg-image" style={{ position: "absolute", inset: 0 }} />
        <div className="aurora-band" />
        <div style={{ position: "absolute", inset: 0, background: "var(--t-overlay)" }} />
        {/* blobs */}
        <div className="blob blob-a" style={blobPos({ top: "-8%", left: "-10%" })} />
        <div className="blob blob-b" style={blobPos({ top: "30%", right: "-12%" })} />
        <div className="blob blob-c" style={blobPos({ bottom: "-18%", left: "20%" })} />
        <div className="blob blob-d" style={blobPos({ top: "10%", left: "40%", width: 380, height: 380 })} />
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "22px 28px 0",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 999,
            background: "var(--t-progress-track)",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: `linear-gradient(90deg, var(--t-progress-fill-from), var(--t-progress-fill-to))`,
              borderRadius: 999,
            }}
            initial={false}
            animate={{ width: `${(currentIndex / total) * 100}%` }}
            transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <span
          style={{
            fontSize: 13,
            letterSpacing: ".04em",
            color: "var(--t-text-muted)",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "var(--t-font-body)",
          }}
        >
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>


      {/* ── Active dynamic ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          minHeight: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${question.id}-${combo.dynamic}-${combo.theme}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {combo.dynamic === "slide" ? (
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

function blobPos(pos: {
  top?: string | number
  bottom?: string | number
  left?: string | number
  right?: string | number
  width?: number
  height?: number
}): React.CSSProperties {
  return {
    position: "absolute",
    width: pos.width ?? 480,
    height: pos.height ?? 480,
    borderRadius: "50%",
    willChange: "transform",
    pointerEvents: "none",
    ...pos,
  }
}
