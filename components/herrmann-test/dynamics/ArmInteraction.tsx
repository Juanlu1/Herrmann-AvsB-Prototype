"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Question } from "@/lib/herrmann-types"

interface ArmInteractionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onSelect: (option: "A" | "B") => void
}

export function ArmInteraction({
  question,
  questionNumber,
  totalQuestions,
  onSelect,
}: ArmInteractionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [armAngle, setArmAngle] = useState(0) // degrees, 0 = straight right
  const [pointing, setPointing] = useState<"A" | "B" | null>(null)
  const [selected, setSelected] = useState<"A" | "B" | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      // shoulder pivot — horizontally centered, vertically at ~55% of container
      const pivotX = rect.left + rect.width / 2
      const pivotY = rect.top + rect.height * 0.52
      const dx = e.clientX - pivotX
      const dy = e.clientY - pivotY
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      setArmAngle(angle)
      setPointing(dx < 0 ? "A" : "B")
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  function handleClick() {
    if (confirming || selected) return
    const choice = pointing ?? "A"
    setSelected(choice)
    setConfirming(true)
    setTimeout(() => {
      onSelect(choice)
    }, 600)
  }

  // Clamp arm angle to avoid awkward upward positions; snap to left/right half
  const clampedAngle = armAngle

  return (
    <div
      ref={containerRef}
      className="arm-interaction relative flex flex-col items-center justify-center min-h-screen select-none"
      onClick={handleClick}
      style={{ cursor: confirming ? "default" : "pointer", touchAction: "none" }}
    >
      {/* Progress */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <span style={{ color: "var(--t-text-muted)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Context text */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-14 left-0 right-0 flex justify-center px-8"
      >
        <p
          style={{
            color: "var(--t-text-heading)",
            fontFamily: "var(--t-font-heading)",
            fontWeight: "var(--t-font-weight-heading)" as never,
            fontStyle: "var(--t-font-style-context)" as never,
            fontSize: "clamp(1rem, 3.5vw, 1.3rem)",
            textAlign: "center",
            maxWidth: "32rem",
          }}
        >
          {question.context}
        </p>
      </motion.div>

      {/* Options — left and right */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 pointer-events-none">
        {/* Option A — left */}
        <motion.div
          animate={{
            scale: selected === "A" ? 1.06 : pointing === "A" ? 1.03 : 1,
            opacity: selected && selected !== "A" ? 0.35 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{ maxWidth: "clamp(8rem, 28vw, 14rem)", pointerEvents: "auto" }}
        >
          <div
            style={{
              background: selected === "A"
                ? "var(--t-option-selected-bg)"
                : pointing === "A"
                ? "var(--t-option-bg)"
                : "var(--t-option-bg)",
              border: `1.5px solid ${
                selected === "A"
                  ? "var(--t-option-selected-border)"
                  : pointing === "A"
                  ? "var(--t-option-selected-border)"
                  : "var(--t-option-border)"
              }`,
              borderRadius: "var(--t-card-radius)",
              padding: "1rem",
              backdropFilter: "var(--t-backdrop)",
              boxShadow: selected === "A" ? "var(--t-option-selected-shadow)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--t-option-selected-border)",
                marginBottom: "0.4rem",
                fontFamily: "var(--t-font-body)",
              }}
            >
              ← Opción A
            </div>
            <p
              style={{
                color: "var(--t-text-body)",
                fontFamily: "var(--t-font-body)",
                fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
                lineHeight: 1.4,
              }}
            >
              {question.optionA.text}
            </p>
          </div>
        </motion.div>

        {/* Option B — right */}
        <motion.div
          animate={{
            scale: selected === "B" ? 1.06 : pointing === "B" ? 1.03 : 1,
            opacity: selected && selected !== "B" ? 0.35 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{ maxWidth: "clamp(8rem, 28vw, 14rem)", pointerEvents: "auto" }}
        >
          <div
            style={{
              background: selected === "B"
                ? "var(--t-option-selected-bg)"
                : "var(--t-option-bg)",
              border: `1.5px solid ${
                selected === "B"
                  ? "var(--t-option-selected-border)"
                  : pointing === "B"
                  ? "var(--t-option-selected-border)"
                  : "var(--t-option-border)"
              }`,
              borderRadius: "var(--t-card-radius)",
              padding: "1rem",
              backdropFilter: "var(--t-backdrop)",
              boxShadow: selected === "B" ? "var(--t-option-selected-shadow)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--t-option-selected-border)",
                marginBottom: "0.4rem",
                fontFamily: "var(--t-font-body)",
                textAlign: "right",
              }}
            >
              Opción B →
            </div>
            <p
              style={{
                color: "var(--t-text-body)",
                fontFamily: "var(--t-font-body)",
                fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
                lineHeight: 1.4,
              }}
            >
              {question.optionB.text}
            </p>
          </div>
        </motion.div>
      </div>

      {/* SVG Character */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 5 }}
      >
        <svg
          width="120"
          height="200"
          viewBox="0 0 120 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          {/* Head */}
          <circle
            cx="60"
            cy="36"
            r="24"
            fill="var(--t-card-bg)"
            stroke="var(--t-option-selected-border)"
            strokeWidth="2"
          />
          {/* Eyes */}
          <circle cx="52" cy="33" r="3" fill="var(--t-text-body)" />
          <circle cx="68" cy="33" r="3" fill="var(--t-text-body)" />
          {/* Smile */}
          <path
            d="M52 44 Q60 50 68 44"
            stroke="var(--t-text-body)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Body */}
          <rect
            x="44"
            y="60"
            width="32"
            height="56"
            rx="10"
            fill="var(--t-card-bg)"
            stroke="var(--t-option-selected-border)"
            strokeWidth="2"
          />

          {/* Left arm (static) */}
          <line
            x1="44"
            y1="75"
            x2="22"
            y2="100"
            stroke="var(--t-option-selected-border)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Rotating arm — pivot at right shoulder (76, 75) */}
          <g
            transform={`rotate(${clampedAngle}, 76, 75)`}
            style={{ transition: "transform 0.05s linear" }}
          >
            <line
              x1="76"
              y1="75"
              x2="120"
              y2="75"
              stroke="var(--t-option-selected-border)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle
              cx="120"
              cy="75"
              r="5"
              fill="var(--t-option-selected-border)"
            />
          </g>

          {/* Legs */}
          <line x1="52" y1="116" x2="44" y2="155" stroke="var(--t-option-selected-border)" strokeWidth="5" strokeLinecap="round" />
          <line x1="68" y1="116" x2="76" y2="155" stroke="var(--t-option-selected-border)" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Hint */}
      <AnimatePresence>
        {!confirming && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: "1.5rem",
              color: "var(--t-text-muted)",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              fontFamily: "var(--t-font-body)",
            }}
          >
            Mové el mouse y hacé click para elegir
          </motion.p>
        )}
      </AnimatePresence>

      {/* Confirming flash */}
      <AnimatePresence>
        {confirming && selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              bottom: "3rem",
              background: "var(--t-option-selected-bg)",
              border: `1.5px solid var(--t-option-selected-border)`,
              borderRadius: "999px",
              padding: "0.5rem 1.5rem",
              color: "var(--t-option-selected-border)",
              fontFamily: "var(--t-font-body)",
              fontSize: "0.85rem",
            }}
          >
            Opción {selected} seleccionada ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
