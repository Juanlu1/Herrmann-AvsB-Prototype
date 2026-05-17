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

export function SlideInteraction({
  question,
  onSelect,
}: SlideInteractionProps) {
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
    [leaving, y, onSelect],
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

  function handleDragUpdate(_: unknown, info: { offset: { y: number } }) {
    const dy = info.offset.y
    if (dy < -40) setTarget("A")
    else if (dy > 40) setTarget("B")
    else setTarget(null)
  }

  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    const dy = info.offset.y
    const vy = info.velocity.y
    const triggered =
      dy < -THRESHOLD || (vy < -500 && dy < -20)
        ? "A"
        : dy > THRESHOLD || (vy > 500 && dy > 20)
        ? "B"
        : null

    if (triggered) {
      commit(triggered)
    } else {
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 })
      setTarget(null)
    }
  }

  const optionStyle = (side: "A" | "B"): React.CSSProperties => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "22px 28px",
    minHeight: 104,
    borderRadius: 32,
    background: target === side
      ? "var(--t-option-selected-bg)"
      : "var(--t-option-bg)",
    border: `1.5px solid ${target === side ? "var(--t-option-selected-border)" : "var(--t-card-border)"}`,
    color: "var(--t-text-heading)",
    fontSize: "clamp(19px, 1.9vw, 23px)",
    lineHeight: 1.32,
    textAlign: "center",
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: "-0.005em",
    cursor: "pointer",
    backdropFilter: "var(--t-backdrop)",
    WebkitBackdropFilter: "var(--t-backdrop)" as never,
    transition: "transform 220ms, box-shadow 220ms, border-color 220ms, background 220ms",
    userSelect: "none",
    appearance: "none" as never,
  })

  return (
    <div
      key={question.id}
      style={{
        position: "relative",
        width: "min(620px, 100%)",
        height: "min(720px, 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: 18,
        userSelect: "none",
      }}
    >
      {/* Option A — above */}
      <button
        className={`slide-option-A${target === "A" ? " is-target" : ""}`}
        style={optionStyle("A")}
        onClick={() => commit("A")}
        aria-label={`Elegir opción A: ${question.optionA.text}`}
        disabled={!!leaving}
      >
        <span style={{ flex: 1, textAlign: "center" }}>{question.optionA.text}</span>
      </button>

      {/* Draggable center situation card */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -200, bottom: 200 }}
        dragElastic={0.4}
        style={{
          y,
          opacity: cardOpacity,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 36px",
          borderRadius: 32,
          background: "var(--t-card-bg)",
          border: "1.5px solid var(--t-card-border)",
          backdropFilter: "var(--t-backdrop)",
          WebkitBackdropFilter: "var(--t-backdrop)" as never,
          cursor: "grab",
          touchAction: "none",
          willChange: "transform",
          boxShadow: "var(--t-shadow-card)",
          zIndex: 10,
          overflow: "hidden",
          pointerEvents: leaving ? "none" : "auto",
        }}
        onDrag={handleDragUpdate}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div style={{
          fontSize: 12,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "var(--t-text-muted)",
          marginBottom: 18,
          fontFamily: "inherit",
          fontWeight: 600,
        }}>
          Situación
        </div>
        <div style={{
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: "clamp(28px, 5vw, 44px)",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: "var(--t-text-heading)",
        }}>
          {question.context}
        </div>
        <div style={{
          marginTop: 22,
          fontSize: 12,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--t-text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>↑</motion.span>
          <span>arrastrá o tocá una opción</span>
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}>↓</motion.span>
        </div>
      </motion.div>

      {/* Option B — below */}
      <button
        className={`slide-option-B${target === "B" ? " is-target" : ""}`}
        style={optionStyle("B")}
        onClick={() => commit("B")}
        aria-label={`Elegir opción B: ${question.optionB.text}`}
        disabled={!!leaving}
      >
        <span style={{ flex: 1, textAlign: "center" }}>{question.optionB.text}</span>
      </button>
    </div>
  )
}
