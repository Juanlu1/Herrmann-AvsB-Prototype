"use client"

import { useRef, useEffect, useCallback, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────
const BALL_RADIUS = 7;
const TARGET_RADIUS = 28;
const FRICTION = 0.988;
const LAUNCH_POWER = 0.30;
const MIN_SPEED = 0.35;
const NUM_TARGETS = 3;
const TRAIL_LENGTH = 7;
const MAX_DRAG = 70;
const RAIL_WIDTH = 7;

// ─── Colors ──────────────────────────────────────────────────────────────
const FELT_COLOR = "#1a5276";
const FELT_DARK  = "#0e3a55";
const RAIL_COLOR = "#5c3a1e";

// ─── Types ───────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number }
interface Target { x: number; y: number; hit: boolean }
interface BallState { x: number; y: number; vx: number; vy: number; moving: boolean }

function dist(a: Vec2, b: Vec2) { return Math.hypot(a.x - b.x, a.y - b.y); }

// ─── Draw bullseye target ─────────────────────────────────────────────────
function drawBullseye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hit: boolean) {
  const rings = [
    { ratio: 0.5,  color: hit ? "#2a2a2a" : "#ffffff" },
    { ratio: 0.41, color: hit ? "#1e1e1e" : "#cc2200" },
    { ratio: 0.32, color: hit ? "#2a2a2a" : "#ffffff" },
    { ratio: 0.23, color: hit ? "#1e1e1e" : "#cc2200" },
    { ratio: 0.13, color: hit ? "#2a2a2a" : "#ffcc00" },
  ];

  rings.forEach(({ ratio, color }) => {
    ctx.beginPath();
    ctx.arc(x, y, r * ratio, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  if (hit) {
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    const s = r * 0.25;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + s, y - s);
    ctx.lineTo(x - s, y + s);
    ctx.stroke();
    ctx.lineCap = "butt";
  }
}

// ─── Draw table ─────────────────────────────────────────────────────────
function drawTable(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const R = RAIL_WIDTH;

  ctx.fillStyle = RAIL_COLOR;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#3a2010";
  ctx.lineWidth = 2;
  ctx.strokeRect(R, R, w - R * 2, h - R * 2);

  const feltGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
  feltGrad.addColorStop(0, FELT_COLOR);
  //feltGrad.addColorStop(1, FELT_DARK);
  ctx.fillStyle = feltGrad;
  ctx.fillRect(R, R, w - R * 2, h - R * 2);

  ctx.fillStyle = "rgba(255,255,255,0.01)";
  for (let i = 0; i < 300; i++) {
    const fx = R + Math.random() * (w - R * 2);
    const fy = R + Math.random() * (h - R * 2);
    ctx.fillRect(fx, fy, 1, 1);
  }
}

// ─── Draw cue ball ──────────────────────────────────────────────────────
function drawCueBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x + 2, y + 2, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fill();

  const grad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
  grad.addColorStop(0, "#f8f8f0");
  grad.addColorStop(0.7, "#e8e4da");
  grad.addColorStop(1, "#c8c0b0");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// ─── Component Interface Adaptation ──────────────────────────────────────
interface DrawingCanvasProps {
  onComplete: () => void
}

export function DrawingCanvas({ onComplete }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const ball = useRef<BallState>({ x: 0, y: 0, vx: 0, vy: 0, moving: false });
  const targets = useRef<Target[]>([]);
  const drag = useRef<{ active: boolean; start: Vec2; current: Vec2 }>({
    active: false, start: { x: 0, y: 0 }, current: { x: 0, y: 0 },
  });
  const trail = useRef<Vec2[]>([]);
  const center = useRef<Vec2>({ x: 0, y: 0 });
  const animId = useRef(0);
  const lastTime = useRef(0);

  const [won, setWon] = useState(false);

  // Evitar Hydration Mismatches bloqueando la ejecución antes de montarse en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPlayArea = (lw: number, lh: number) => ({
    left: RAIL_WIDTH,
    top: RAIL_WIDTH,
    right: lw - RAIL_WIDTH,
    bottom: lh - RAIL_WIDTH,
    w: lw - RAIL_WIDTH * 2,
    h: lh - RAIL_WIDTH * 2,
  });

  const initGame = useCallback((_canvas: HTMLCanvasElement) => {
    trail.current = [];
    ball.current = { x: 0, y: 0, vx: 0, vy: 0, moving: false };
    setWon(false);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const lw = rect.width;
    const lh = rect.height;
    (canvas as any).__lw = lw;
    (canvas as any).__lh = lh;

    const play = getPlayArea(lw, lh);

    center.current = { x: lw / 2, y: play.top + play.h * 0.72 };
    if (!ball.current.moving) {
      ball.current.x = center.current.x;
      ball.current.y = center.current.y;
    }

    const sideY = play.top + play.h * 0.08;
    const centerY = play.top + play.h * 0.22;
    const margin = TARGET_RADIUS + 8;
    const leftX = play.left + margin;
    const rightX = play.right - margin;
    const centerX = lw / 2;
    const targetData = [
      { x: leftX, y: sideY },
      { x: centerX, y: centerY },
      { x: rightX, y: sideY },
    ];
    if (targets.current.length === 0) {
      targets.current = targetData.map((td) => ({
        x: td.x,
        y: td.y,
        hit: false,
      }));
    } else {
      targets.current.forEach((t, i) => {
        t.x = targetData[i].x;
        t.y = targetData[i].y;
      });
    }
  }, []);

  const getPos = (e: PointerEvent): Vec2 => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (ball.current.moving || won) return;
    const pos = getPos(e);
    if (dist(pos, ball.current) < BALL_RADIUS * 3.5) {
      drag.current = { active: true, start: { ...pos }, current: { ...pos } };
      (e.target as Element)?.setPointerCapture?.(e.pointerId);
    }
  }, [won]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!drag.current.active) return;
    const pos = getPos(e);
    const dx = pos.x - drag.current.start.x;
    const dy = pos.y - drag.current.start.y;
    const d = Math.hypot(dx, dy);
    if (d > MAX_DRAG) {
      const r = MAX_DRAG / d;
      pos.x = drag.current.start.x + dx * r;
      pos.y = drag.current.start.y + dy * r;
    }
    drag.current.current = pos;
    ball.current.x = center.current.x + (pos.x - drag.current.start.x);
    ball.current.y = center.current.y + (pos.y - drag.current.start.y);
  }, []);

  const onPointerUp = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = drag.current.current.x - drag.current.start.x;
    const dy = drag.current.current.y - drag.current.start.y;
    const power = Math.hypot(dx, dy);
    if (power > 10) {
      ball.current.vx = -dx * LAUNCH_POWER;
      ball.current.vy = -dy * LAUNCH_POWER;
      ball.current.moving = true;
    } else {
      ball.current.x = center.current.x;
      ball.current.y = center.current.y;
    }
  }, []);

  const tick = useCallback(() => {
    const b = ball.current;
    if (!b.moving) return;
    const canvas = canvasRef.current!;
    const lw = (canvas as any).__lw as number;
    const lh = (canvas as any).__lh as number;
    const play = getPlayArea(lw, lh);

    b.x += b.vx;
    b.y += b.vy;

    if (b.x - BALL_RADIUS < play.left) { b.x = play.left + BALL_RADIUS; b.vx *= -0.82; }
    if (b.x + BALL_RADIUS > play.right) { b.x = play.right - BALL_RADIUS; b.vx *= -0.82; }
    if (b.y - BALL_RADIUS < play.top) { b.y = play.top + BALL_RADIUS; b.vy *= -0.82; }
    if (b.y + BALL_RADIUS > play.bottom) { b.y = play.bottom - BALL_RADIUS; b.vy *= -0.82; }

    b.vx *= FRICTION;
    b.vy *= FRICTION;

    trail.current.push({ x: b.x, y: b.y });
    if (trail.current.length > TRAIL_LENGTH) trail.current.shift();

    let newHits = 0;
    targets.current.forEach((t) => {
      if (t.hit) return;
      const d = dist(b, t);
      if (d < BALL_RADIUS + TARGET_RADIUS) {
        t.hit = true;
        newHits++;
        const nx = (b.x - t.x) / d;
        const ny = (b.y - t.y) / d;
        const dot = b.vx * nx + b.vy * ny;
        b.vx -= 2 * dot * nx * 0.7;
        b.vy -= 2 * dot * ny * 0.7;
        const overlap = BALL_RADIUS + TARGET_RADIUS - d;
        b.x += nx * overlap;
        b.y += ny * overlap;
      }
    });

    if (newHits > 0) {
      const allHit = targets.current.every(t => t.hit);
      if (allHit) {
        setWon(true);
      }
    }

    const speed = Math.hypot(b.vx, b.vy);
    if (speed < MIN_SPEED) {
      b.moving = false;
      b.vx = 0;
      b.vy = 0;
      b.x = center.current.x;
      b.y = center.current.y;
      trail.current = [];
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const lw = (canvas as any).__lw as number;
    const lh = (canvas as any).__lh as number;

    ctx.clearRect(0, 0, lw, lh);
    drawTable(ctx, lw, lh);

    targets.current.forEach((t) => drawBullseye(ctx, t.x, t.y, TARGET_RADIUS, t.hit));

    if (drag.current.active) {
      const b = ball.current;
      const dx = drag.current.current.x - drag.current.start.x;
      const dy = drag.current.current.y - drag.current.start.y;
      const power = Math.hypot(dx, dy);

      if (power > 10) {
        const dirX = -dx / power;
        const dirY = -dy / power;
        const dotCount = Math.floor(power / 12);
        for (let i = 1; i <= dotCount; i++) {
          const alpha = 1 - i / (dotCount + 1);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(b.x + dirX * i * 18, b.y + dirY * i * 18, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.strokeStyle = "rgba(251,191,36,0.6)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(center.current.x - 30, center.current.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(center.current.x + 30, center.current.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (trail.current.length > 1) {
      for (let i = 1; i < trail.current.length; i++) {
        const alpha = (i / trail.current.length) * 0.18;
        ctx.strokeStyle = `rgba(180,210,240,${alpha})`;
        ctx.lineWidth = BALL_RADIUS * 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(trail.current[i - 1].x, trail.current[i - 1].y);
        ctx.lineTo(trail.current[i].x, trail.current[i].y);
        ctx.stroke();
        ctx.lineCap = "butt";
      }
    }

    drawCueBall(ctx, ball.current.x, ball.current.y, BALL_RADIUS);

    if (!ball.current.moving && !drag.current.active) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center.current.x, center.current.y, BALL_RADIUS + 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(251,191,36,0.35)";
      ctx.beginPath();
      ctx.arc(center.current.x - 30, center.current.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center.current.x + 30, center.current.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const loop = useCallback((time: number) => {
    const dt = time - lastTime.current;
    lastTime.current = time;
    const steps = Math.min(Math.round(dt / 16.67), 4) || 1;
    for (let i = 0; i < steps; i++) tick();
    draw();
    animId.current = requestAnimationFrame(loop);
  }, [tick, draw]);

  useEffect(() => {
    if (!isMounted) return;
    const canvas = canvasRef.current!;
    resize();
    initGame(canvas);
    resize();
    lastTime.current = performance.now();
    animId.current = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [isMounted, resize, initGame, loop, onPointerDown, onPointerMove, onPointerUp]);

  const handleContinue = () => {
    targets.current = [];
    const canvas = canvasRef.current!;
    initGame(canvas);
    resize();
    if (onComplete) onComplete();
  };

  // Renderizado defensivo pre-hidratación
  if (!isMounted) {
    return <div className="w-full h-[320px] bg-slate-800 rounded-2xl animate-pulse" />;
  }

  return (
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-700 shadow-lg" style={{ background: "#3a2010" }}>
        <canvas
            ref={canvasRef}
            className="block w-full h-full"
            style={{ touchAction: "none" }}
        />

        {/* Indicador de arrastre */}
        {!ball.current.moving && !won && (
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none"
                 style={{ bottom: RAIL_WIDTH + 12 }}>
          <span className="text-white/40 text-xs tracking-widest uppercase font-sans selection:bg-transparent">
            Arrastra la bola y suelta
          </span>
            </div>
        )}

        {/* Panel integrado de "¡Bien hecho!" (Overlay translúcido) */}
        {won && (
            <div className="absolute top-0 left-0 w-full h-full bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-fade-in z-50 pointer-events-auto">
              {console.log("WON")}
              <span className="text-4xl mb-1"></span>
              <h4 className="text-xl font-black text-slate-800 tracking-tight font-sans">
                ¡Bien hecho!
              </h4>
              <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-4 px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all active:scale-95 font-sans"
              >
                Continuar
              </button>
            </div>
        )}
      </div>
  );
}