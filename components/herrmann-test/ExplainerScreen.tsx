"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ExplainerScreenProps {
  onContinue: () => void
}

export function ExplainerScreen({ onContinue }: ExplainerScreenProps) {
  const [demoSplit, setDemoSplit] = useState<"A" | "B">("A")

  useEffect(() => {
    const id = setInterval(() => setDemoSplit(s => (s === "A" ? "B" : "A")), 1600)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-center min-h-screen px-4 py-8"
    >
      <div
        style={{
          width: "100%",
          maxWidth: 880,
          padding: "24px 20px 22px",
          borderRadius: 22,
          background: "rgba(22, 24, 36, 0.78)",
          border: "1px solid rgba(255,255,255,.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          color: "#e7e9f4",
          fontFamily: "'Big Shoulders Display', 'Roboto Condensed', 'Arial Narrow', system-ui, sans-serif",
        }}
      >
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 999,
          background: "rgba(52, 211, 153, .12)",
          border: "1px solid rgba(52, 211, 153, .22)",
          color: "#6ee7b7",
          fontSize: 12,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 14,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", display: "inline-block" }} />
          Cómo funciona
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "inherit",
          fontWeight: 800,
          fontSize: "clamp(26px, 7vw, 40px)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: "#f5f6fb",
          margin: "0 0 12px",
        }}>
          Dos formas de elegir<br />a lo largo del test
        </h1>

        {/* Lede */}
        <p style={{
          fontSize: "clamp(14px, 3.6vw, 16px)",
          lineHeight: 1.5,
          color: "#b8becc",
          margin: "0 0 18px",
          maxWidth: 640,
        }}>
          El test va a alternar entre estas dos dinámicas. Cada bloque cambia de atmósfera
          y de forma de responder — es la misma decisión, presentada distinto.
        </p>

        {/* Demo grid */}
        <div className="explainer-demo-grid">
          {/* Slide demo */}
          <div style={demoCardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ fontFamily: "inherit", fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800, color: "#f5f6fb", letterSpacing: "-0.01em", textTransform: "uppercase" }}>
                Slide
              </div>
              <div style={tagStyle}>Vertical</div>
            </div>
            <div style={demoVisualStyle}>
              <div style={{ position: "relative", width: "78%", display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>
                <div style={demoRowStyle}>opción A</div>
                <div style={demoCardInnerStyle}>situación</div>
                <div style={demoRowStyle}>opción B</div>
              </div>
            </div>
          </div>

          {/* Split demo */}
          <div style={demoCardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ fontFamily: "inherit", fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800, color: "#f5f6fb", letterSpacing: "-0.01em", textTransform: "uppercase" }}>
                Split
              </div>
              <div style={tagStyle}>Horizontal</div>
            </div>
            <div style={demoVisualStyle}>
              <div style={{ position: "relative", width: "80%", height: 84, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div style={demoHalfStyle(demoSplit === "A")}>opción A</div>
                <div style={demoHalfStyle(demoSplit === "B")}>opción B</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="explainer-footer-responsive">
          <span style={{ fontSize: 13, color: "#8d93a8", lineHeight: 1.5, textAlign: "center" }}>
            No hay respuestas correctas. Elegí lo primero que se te venga.
          </span>
          <button
            onClick={onContinue}
            style={{
              appearance: "none" as never,
              border: "1px solid rgba(163,163,163,.18)",
              background: "linear-gradient(135deg, #1f1f1f, #323232 55%, #5a5a5a)",
              color: "#f2f2f2",
              padding: "16px 28px",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: ".02em",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 12px 28px rgba(24,24,24,.45), inset 0 1px 0 rgba(255,255,255,.06)",
              transition: "transform 160ms, box-shadow 160ms, border-color 160ms, background 160ms",
              width: "100%",
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = "" }}
          >
            Empezar
          </button>
        </div>
      </div>

      <style>{`
        .explainer-demo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin: 18px 0 22px;
        }
        .explainer-footer-responsive {
          display: flex;
          flex-direction: column-reverse;
          align-items: stretch;
          gap: 14px;
        }
        @keyframes demo-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (min-width: 720px) {
          .explainer-demo-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 24px 0 28px;
          }
          .explainer-footer-responsive {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .explainer-footer-responsive button {
            width: auto !important;
            padding: 14px 30px !important;
          }
          .explainer-footer-responsive span {
            text-align: left !important;
            max-width: 360px;
          }
        }
      `}</style>
    </motion.div>
  )
}

const demoCardStyle: React.CSSProperties = {
  position: "relative",
  padding: "18px 16px",
  borderRadius: 16,
  background: "rgba(255,255,255,.035)",
  border: "1px solid rgba(255,255,255,.08)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
}

const tagStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#9aa0b4",
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  fontWeight: 600,
}

const demoVisualStyle: React.CSSProperties = {
  position: "relative",
  height: "clamp(110px, 28vw, 140px)",
  borderRadius: 14,
  background: "rgba(0,0,0,.25)",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const demoRowStyle: React.CSSProperties = {
  height: 24,
  borderRadius: 10,
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  color: "#9aa0b4",
  fontWeight: 600,
  letterSpacing: ".04em",
}

const demoCardInnerStyle: React.CSSProperties = {
  height: 40,
  borderRadius: 10,
  background: "linear-gradient(135deg, rgba(45,212,191,.22), rgba(59,130,246,.22))",
  border: "1px solid rgba(45,212,191,.45)",
  color: "#e0f5ef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  fontWeight: 800,
  animation: "demo-bob 2.4s ease-in-out infinite",
}

function demoHalfStyle(active: boolean): React.CSSProperties {
  return {
    borderRadius: 10,
    border: `1px solid ${active ? "rgba(139,92,246,.45)" : "rgba(255,255,255,.08)"}`,
    background: active
      ? "linear-gradient(135deg, rgba(139,92,246,.22), rgba(59,130,246,.22))"
      : "rgba(255,255,255,.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    color: active ? "#f0f5ff" : "#9aa0b4",
    fontWeight: 600,
    letterSpacing: ".04em",
    transition: "background 220ms, border-color 220ms, color 220ms",
  }
}
