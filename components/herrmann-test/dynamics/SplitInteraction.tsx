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

  const sharedHalfStyle: React.CSSProperties = {
    appearance: "none" as never,
    border: "none",
    padding: 0,
    margin: 0,
    cursor: isLeaving ? "default" : "pointer",
    background: "transparent",
    fontFamily: "inherit",
    color: "var(--t-text-heading)",
    display: "flex",
    alignItems: "stretch",
    minHeight: 0,
    width: "100%",
  }

  const innerBase: React.CSSProperties = {
    width: "100%",
    height: "100%",
    padding: "24px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 14,
    borderRadius: 24,
    background: "var(--t-card-bg)",
    border: "1.5px solid var(--t-card-border)",
    backdropFilter: "var(--t-backdrop)",
    WebkitBackdropFilter: "var(--t-backdrop)" as never,
    transition: "border-color 240ms, box-shadow 240ms, opacity 240ms, transform 300ms",
    boxShadow: "var(--t-shadow-card)",
    overflow: "hidden",
  }

  function getHalfInnerStyle(side: "A" | "B"): React.CSSProperties {
    const isTarget = target === side
    const isOther = target !== null && target !== side
    const isChosen = leaving === side
    const isRejected = leaving !== null && leaving !== side

    return {
      ...innerBase,
      borderColor: isTarget ? "var(--t-option-selected-border)" : "var(--t-card-border)",
      boxShadow: isChosen
        ? "var(--t-option-selected-shadow)"
        : "var(--t-shadow-card)",
      opacity: isRejected ? 0 : isOther ? 0.55 : 1,
      transform: isTarget ? "scale(1.012)" : isChosen ? "scale(1.025)" : "scale(1)",
    }
  }

  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 12,
    background: "rgba(255,255,255,.06)",
    color: "var(--t-text-muted)",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: ".04em",
    flexShrink: 0,
  }

  const optionTextStyle: React.CSSProperties = {
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "clamp(20px, 5vw, 24px)",
    lineHeight: 1.28,
    letterSpacing: "-0.01em",
    color: "var(--t-text-heading)",
    maxWidth: 420,
  }

  const contextCardStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "16px 22px",
    borderRadius: 20,
    background: "var(--t-card-bg)",
    border: "1.5px solid var(--t-card-border)",
    backdropFilter: "var(--t-backdrop)",
    WebkitBackdropFilter: "var(--t-backdrop)" as never,
    boxShadow: "var(--t-shadow-card)",
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    justifySelf: "center",
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "grid",
        userSelect: "none",
      }}
      className="split-stage-grid"
    >
      {/* Option A */}
      <button
        style={{ ...sharedHalfStyle, gridArea: "a" }}
        onPointerEnter={() => !committedRef.current && setTarget("A")}
        onPointerLeave={() => !committedRef.current && setTarget(t => t === "A" ? null : t)}
        onClick={() => commit("A")}
        aria-label={`Elegir A: ${question.optionA.text}`}
      >
        <div style={getHalfInnerStyle("A")}>
          <div style={tagStyle}>A</div>
          <div style={optionTextStyle}>{question.optionA.text}</div>
        </div>
      </button>

      {/* Context — absolute pill on mobile, in-grid on desktop */}
      <div className="split-ctx-wrapper">
        <div style={contextCardStyle}>
          <div style={{
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "var(--t-text-muted)",
            marginBottom: 6,
            fontFamily: "inherit",
            fontWeight: 600,
          }}>
            Situación
          </div>
          <div style={{
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: "clamp(18px, 4.4vw, 22px)",
            lineHeight: 1.28,
            letterSpacing: "-0.01em",
            color: "var(--t-text-heading)",
          }}>
            {question.context}
          </div>
        </div>
      </div>

      {/* Option B */}
      <button
        style={{ ...sharedHalfStyle, gridArea: "b" }}
        onPointerEnter={() => !committedRef.current && setTarget("B")}
        onPointerLeave={() => !committedRef.current && setTarget(t => t === "B" ? null : t)}
        onClick={() => commit("B")}
        aria-label={`Elegir B: ${question.optionB.text}`}
      >
        <div style={getHalfInnerStyle("B")}>
          <div style={tagStyle}>B</div>
          <div style={optionTextStyle}>{question.optionB.text}</div>
        </div>
      </button>

      <style>{`
        /* Mobile: two equal halves, no gap */
        .split-stage-grid {
          grid-template-areas: "a" "b";
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1fr;
          gap: 0;
        }

        /* Context pill: absolute, centered between the two halves */
        .split-ctx-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          display: flex;
          justify-content: center;
          width: 88%;
          pointer-events: none;
        }

        /* Mobile inner card: A rounded on top, B rounded on bottom, flush where they meet */
        .split-stage-grid > button:first-of-type > div {
          border-radius: 20px 20px 0 0 !important;
        }
        .split-stage-grid > button:last-of-type > div {
          border-radius: 0 0 20px 20px !important;
        }

        /* Desktop: context on top row, options side by side */
        @media (min-width: 720px) {
          .split-stage-grid {
            grid-template-areas: "ctx ctx" "a b" !important;
            grid-template-rows: auto 1fr !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          .split-ctx-wrapper {
            position: static !important;
            transform: none !important;
            grid-area: ctx !important;
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
            pointer-events: auto !important;
          }
          .split-stage-grid > button > div {
            padding: 36px 28px !important;
            border-radius: 28px !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
