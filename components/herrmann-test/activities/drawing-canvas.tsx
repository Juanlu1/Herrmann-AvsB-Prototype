"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Check } from "lucide-react"

interface DrawingCanvasProps {
  onComplete: () => void
}

export function DrawingCanvas({ onComplete }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Fill white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Set drawing style
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    if ("touches" in e) {
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    setHasDrawn(true)
    const { x, y } = getCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [getCoords])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoords(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing, getCoords])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, rect.width, rect.height)
    setHasDrawn(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Dibujá lo que quieras</h3>
        <p className="text-muted-foreground text-sm">
          Usá tu dedo o el mouse para dibujar libremente
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] rounded-2xl border border-border/50 cursor-crosshair touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={clearCanvas} variant="outline" size="lg" className="rounded-full">
          <Eraser className="w-5 h-5 mr-2" />
          Borrar
        </Button>
        {hasDrawn && (
          <Button onClick={onComplete} size="lg" className="rounded-full bg-primary hover:bg-primary/90">
            <Check className="w-5 h-5 mr-2" />
            Listo
          </Button>
        )}
      </div>
    </div>
  )
}
