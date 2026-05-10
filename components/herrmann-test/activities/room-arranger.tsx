"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, RotateCcw, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const ROOM_W = 300
const ROOM_H = 220

const FURNITURE = [
  { id: "cama",       name: "Cama",       emoji: "🛏️", w: 72, h: 48, color: "bg-indigo-400/90" },
  { id: "escritorio", name: "Escritorio", emoji: "🖥️", w: 58, h: 36, color: "bg-amber-500/90" },
  { id: "sillon",     name: "Sillón",     emoji: "🛋️", w: 54, h: 38, color: "bg-rose-400/90" },
  { id: "planta",     name: "Planta",     emoji: "🪴", w: 30, h: 36, color: "bg-emerald-500/90" },
  { id: "lampara",    name: "Lámpara",    emoji: "💡", w: 28, h: 32, color: "bg-yellow-400/90" },
]

const TARGET_SLOTS = [
  { id: "cama",       x: 10,  y: 10,  w: 72, h: 48 },
  { id: "escritorio", x: 170, y: 10,  w: 58, h: 36 },
  { id: "sillon",     x: 10,  y: 130, w: 54, h: 38 },
  { id: "planta",     x: 230, y: 130, w: 30, h: 36 },
  { id: "lampara",    x: 120, y: 150, w: 28, h: 32 },
]

// Row 1 (y=8):  cama x:8-80 | escritorio x:90-148 | sillon x:158-212
// Row 2 (y=80): planta x:8-38 | lampara x:50-78
const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  cama:       { x: 8,   y: 8  },
  escritorio: { x: 90,  y: 8  },
  sillon:     { x: 158, y: 8  },
  planta:     { x: 8,   y: 80 },
  lampara:    { x: 50,  y: 80 },
}

interface Pos { x: number; y: number }

interface RoomArrangerProps {
  selectedOption: "A" | "B"
  onComplete: () => void
}

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  )
}

export function RoomArranger({ selectedOption, onComplete }: RoomArrangerProps) {
  const isCreative = selectedOption === "A"
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [positions, setPositions] = useState<Record<string, Pos>>({ ...INITIAL_POSITIONS })
  const [snapped, setSnapped] = useState<Record<string, boolean>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [hasMoved, setHasMoved] = useState(false)

  const positionsRef = useRef<Record<string, Pos>>({ ...INITIAL_POSITIONS })
  const scaleRef = useRef(1)
  const dragRef = useRef<{ id: string; startPointer: Pos; startItem: Pos } | null>(null)

  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return
      const available = wrapperRef.current.offsetWidth
      const s = Math.min(1, available / ROOM_W)
      setScale(s)
      scaleRef.current = s
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  const updatePositions = useCallback(
    (updater: (prev: Record<string, Pos>) => Record<string, Pos>) => {
      setPositions(prev => {
        const next = updater(prev)
        positionsRef.current = next
        return next
      })
    },
    []
  )

  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = {
      id,
      startPointer: { x: e.clientX, y: e.clientY },
      startItem: { ...positionsRef.current[id] },
    }
    setDraggingId(id)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (!dragRef.current || dragRef.current.id !== id) return
      const s = scaleRef.current
      const item = FURNITURE.find(f => f.id === id)!
      const dx = (e.clientX - dragRef.current.startPointer.x) / s
      const dy = (e.clientY - dragRef.current.startPointer.y) / s

      const nextX = Math.max(0, Math.min(dragRef.current.startItem.x + dx, ROOM_W - item.w))
      const nextY = Math.max(0, Math.min(dragRef.current.startItem.y + dy, ROOM_H - item.h))

      const collides = FURNITURE.filter(f => f.id !== id).some(other => {
        const op = positionsRef.current[other.id]
        return op && rectsOverlap(
          { x: nextX, y: nextY, w: item.w, h: item.h },
          { ...op, w: other.w, h: other.h }
        )
      })

      if (!collides) {
        updatePositions(p => ({ ...p, [id]: { x: nextX, y: nextY } }))
      }
    },
    [updatePositions]
  )

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent, id: string) => {
      if (!dragRef.current || dragRef.current.id !== id) return

      const cur = positionsRef.current[id]

      if (!isCreative) {
        const slot = TARGET_SLOTS.find(s => s.id === id)!
        const near = Math.abs(cur.x - slot.x) < 30 && Math.abs(cur.y - slot.y) < 30
        if (near) {
          updatePositions(p => ({ ...p, [id]: { x: slot.x, y: slot.y } }))
          setSnapped(s => ({ ...s, [id]: true }))
          setHasMoved(true)
          dragRef.current = null
          setDraggingId(null)
          return
        }
        setSnapped(s => ({ ...s, [id]: false }))
      }

      setHasMoved(true)
      dragRef.current = null
      setDraggingId(null)
    },
    [isCreative, updatePositions]
  )

  const handlePointerCancel = useCallback((id: string) => {
    if (dragRef.current?.id === id) {
      dragRef.current = null
      setDraggingId(null)
    }
  }, [])

  const reset = useCallback(() => {
    positionsRef.current = { ...INITIAL_POSITIONS }
    setPositions({ ...INITIAL_POSITIONS })
    setSnapped({})
    setHasMoved(false)
    dragRef.current = null
    setDraggingId(null)
  }, [])

  const randomize = useCallback(() => {
    const next: Record<string, Pos> = {}
    const placed: Array<{ x: number; y: number; w: number; h: number }> = []
    FURNITURE.forEach(f => {
      let candidate: Pos = { x: 0, y: 0 }
      let tries = 0
      do {
        candidate = {
          x: Math.random() * (ROOM_W - f.w - 10) + 5,
          y: Math.random() * (ROOM_H - f.h - 10) + 5,
        }
        tries++
      } while (
        tries < 200 &&
        placed.some(p => rectsOverlap({ ...candidate, w: f.w, h: f.h }, p))
      )
      next[f.id] = candidate
      placed.push({ ...candidate, w: f.w, h: f.h })
    })
    positionsRef.current = next
    setPositions(next)
    setHasMoved(true)
  }, [])

  const allSnapped = FURNITURE.every(f => snapped[f.id])

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold">
          {isCreative ? "Decorá tu cuarto" : "Ordená el cuarto"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isCreative
            ? "Arrastrá los muebles donde quieras"
            : "Colocá cada mueble en su lugar indicado"}
        </p>
      </div>

      {/* wrapperRef measures available width to compute scale */}
      <div ref={wrapperRef} className="w-full flex justify-center">
        {/* Outer div: visually scaled size, clips overflow */}
        <div
          className="relative overflow-hidden rounded-2xl ring-4 ring-stone-400"
          style={{
            width: ROOM_W * scale,
            height: ROOM_H * scale,
            background: "linear-gradient(150deg, #fef9ee 0%, #fde68a 100%)",
          }}
        >
          {/* Inner div: full room size, scaled down via CSS transform */}
          <div
            style={{
              position: "relative",
              width: ROOM_W,
              height: ROOM_H,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          >
            {/* Decorative grid */}
            <svg
              className="absolute inset-0 opacity-15 pointer-events-none"
              width={ROOM_W}
              height={ROOM_H}
            >
              {Array.from({ length: 9 }).map((_, col) =>
                Array.from({ length: 7 }).map((_, row) => (
                  <rect
                    key={`${col}-${row}`}
                    x={col * 34} y={row * 32}
                    width={33} height={31}
                    fill="none" stroke="#92400e" strokeWidth="0.7"
                  />
                ))
              )}
            </svg>

            {/* Target slots (mode B) */}
            {!isCreative && TARGET_SLOTS.map(slot => (
              <div
                key={slot.id}
                className={cn(
                  "absolute rounded-xl border-2 border-dashed flex items-center justify-center transition-colors",
                  snapped[slot.id]
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-stone-400/60 bg-stone-300/20"
                )}
                style={{ left: slot.x, top: slot.y, width: slot.w, height: slot.h }}
              >
                {!snapped[slot.id] && (
                  <span className="text-[9px] font-semibold text-stone-500 text-center px-1 leading-tight">
                    {FURNITURE.find(f => f.id === slot.id)?.name}
                  </span>
                )}
              </div>
            ))}

            {/* Draggable furniture — pointer events, no Framer Motion drag */}
            {FURNITURE.map(item => {
              const pos = positions[item.id] ?? INITIAL_POSITIONS[item.id]
              const isDragging = draggingId === item.id
              return (
                <div
                  key={item.id}
                  onPointerDown={e => handlePointerDown(e, item.id)}
                  onPointerMove={e => handlePointerMove(e, item.id)}
                  onPointerUp={e => handlePointerUp(e, item.id)}
                  onPointerCancel={() => handlePointerCancel(item.id)}
                  className={cn(
                    "absolute rounded-xl shadow-md flex flex-col items-center justify-center select-none",
                    "cursor-grab active:cursor-grabbing",
                    item.color,
                    isDragging && "shadow-xl",
                    snapped[item.id] && "ring-2 ring-emerald-400 shadow-emerald-200"
                  )}
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: item.w,
                    height: item.h,
                    touchAction: "none",
                    zIndex: isDragging ? 50 : 5,
                    transform: isDragging ? "scale(1.08)" : "scale(1)",
                    transition: isDragging
                      ? "transform 0.1s"
                      : "left 0.12s ease-out, top 0.12s ease-out, transform 0.15s",
                  }}
                >
                  <span className="text-lg leading-none">{item.emoji}</span>
                  <span className="text-[9px] font-bold text-white drop-shadow mt-0.5 leading-tight text-center px-1">
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {!isCreative && allSnapped && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-semibold text-emerald-600"
        >
          ✅ Todo en su lugar!
        </motion.p>
      )}

      <div className="flex justify-center gap-3 flex-wrap">
        <Button onClick={reset} variant="outline" size="lg" className="rounded-full gap-2">
          <RotateCcw className="w-4 h-4" /> Reiniciar
        </Button>
        {isCreative && (
          <Button onClick={randomize} variant="outline" size="lg" className="rounded-full gap-2">
            <Sparkles className="w-4 h-4" /> Random
          </Button>
        )}
        {(hasMoved || allSnapped) && (
          <Button onClick={onComplete} size="lg" className="rounded-full gap-2 bg-primary hover:bg-primary/90">
            <Check className="w-4 h-4" /> Listo
          </Button>
        )}
      </div>
    </div>
  )
}
