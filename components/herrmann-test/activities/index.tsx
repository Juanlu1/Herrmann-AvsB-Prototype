"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BlockGame } from "./block-game"
import { BallGame } from "./ball-game"
import { PuzzleGame } from "./puzzle-game"
import { BalloonGame } from "./balloon-game"
import { ImageGame } from "./image-game"

interface ActivityWrapperProps {
  activityType: string
  onComplete: () => void
  onSkip: () => void
}

export function ActivityWrapper({ activityType, onComplete, onSkip }: ActivityWrapperProps) {

  const renderActivity = () => {
    switch (activityType) {
      case 'blocks':
        return <BlockGame onComplete={onComplete} />
      case 'ball':
        return <BallGame onComplete={onComplete} />
      case 'puzzle':
        return <PuzzleGame onComplete={onComplete} />
      case 'balloon':
        return <BalloonGame onComplete={onComplete} />
      case 'image':
        return <ImageGame onComplete={onComplete} />
      default:
        return null
    }
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

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
        {/* Background stack (Igual al TestEngine) */}
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

        {/* ── Content ── */}
        <div
            className="relative z-10 w-full h-full overflow-y-auto"
            style={{ padding: "40px 24px" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2
                  className="text-3xl font-bold mb-2"
                  style={{ color: "var(--t-text-title)", fontFamily: "var(--t-font-title)" }}
              >
                ¡Hora de una actividad!
              </h2>
              <p style={{ color: "var(--t-text-body)", opacity: 1 }} >
                Se puede completar u omitir
              </p>
            </div>

            <div
                className="backdrop-blur-md rounded-3xl p-6 md:p-12 shadow-2xl border mb-8"
                style={{
                  background: "var(--t-card-bg, rgba(255, 255, 255, 0.05))",
                  borderColor: "var(--t-card-border, rgba(255, 255, 255, 0.1))"
                }}
            >
              <div className="flex items-center justify-center min-h-[300px]">
                {renderActivity()}
              </div>
            </div>
              <br/>
            <div className="flex justify-center pb-10">
              <Button
                  variant="outline"
                  size="lg"
                  onClick={onSkip}
                  className="rounded-full px-8 transition-all hover:scale-105"
                  style={{
                    borderColor: "var(--t-text-muted)",
                    color: "var(--t-text-body)",
                    background: "transparent",
                  }}
              >
                Omitir
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
  )
}