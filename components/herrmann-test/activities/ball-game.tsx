"use client"

import { useRef, useEffect, useCallback, useState } from "react";

// --- Constants ---
const BALL_RADIUS = 7;
const TARGET_RADIUS = 28;
const FRICTION = 0.988;
const LAUNCH_POWER = 0.30;
const MIN_SPEED = 0.35;
const NUM_TARGETS = 3;
const TRAIL_LENGTH = 7;
const MAX_DRAG = 50;
const RAIL_WIDTH = 7;

const FELT_COLOR = "#1a5276";
const RAIL_COLOR = "#5c3a1e";

interface Vec2 { x: number; y: number }
interface Target { x: number; y: number; hit: boolean }
interface BallState { x: number; y: number; vx: number; vy: number; moving: boolean }

function dist(a: Vec2, b: Vec2) { return Math.hypot(a.x - b.x, a.y - b.y); }

// --- Drawing Helpers ---
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
    ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke();
    ctx.lineCap = "butt";
  }
}

function drawTable(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const R = RAIL_WIDTH;
  ctx.fillStyle = RAIL_COLOR;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#3a2010";
  ctx.lineWidth = 2;
  ctx.strokeRect(R, R, w - R * 2, h - R * 2);
  const feltGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
  feltGrad.addColorStop(0, FELT_COLOR);
  ctx.fillStyle = feltGrad;
  ctx.fillRect(R, R, w - R * 2, h - R * 2);
}

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
}

interface DrawingCanvasProps { onComplete: () => void }

export function BallGame({ onComplete }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [won, setWon] = useState(false);

  const ball = useRef<BallState>({x: 0, y: 0, vx: 0, vy: 0, moving: false});
  const targets = useRef<Target[]>([]);
  const drag = useRef({ active: false, start: {x: 0, y: 0}, current: {x: 0, y: 0} });
  const center = useRef<Vec2>({x: 0, y: 0});
  const animId = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    setWon(false);
    return () => cancelAnimationFrame(animId.current);
  }, []);

  const getPlayArea = (lw: number, lh: number) => ({
    left: RAIL_WIDTH, top: RAIL_WIDTH, right: lw - RAIL_WIDTH, bottom: lh - RAIL_WIDTH,
  });

  const tick = useCallback(() => {
    if (!ball.current.moving || won) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const lw = (canvas as any).__lw;
    const lh = (canvas as any).__lh;
    const play = getPlayArea(lw, lh);

    const b = ball.current;
    b.x += b.vx; b.y += b.vy;

    if (b.x - BALL_RADIUS < play.left) { b.x = play.left + BALL_RADIUS; b.vx *= -0.82; }
    if (b.x + BALL_RADIUS > play.right) { b.x = play.right - BALL_RADIUS; b.vx *= -0.82; }
    if (b.y - BALL_RADIUS < play.top) { b.y = play.top + BALL_RADIUS; b.vy *= -0.82; }
    if (b.y + BALL_RADIUS > play.bottom) { b.y = play.bottom - BALL_RADIUS; b.vy *= -0.82; }

    b.vx *= FRICTION; b.vy *= FRICTION;

    targets.current.forEach((t) => {
      if (t.hit) return;
      const d = dist(b, t);
      if (d < BALL_RADIUS + TARGET_RADIUS) {
        t.hit = true;
        const nx = (b.x - t.x) / d; const ny = (b.y - t.y) / d;
        const dot = b.vx * nx + b.vy * ny;
        b.vx -= 2 * dot * nx * 0.7; b.vy -= 2 * dot * ny * 0.7;
      }
    });

    const allHit = targets.current.length > 0 && targets.current.every(t => t.hit);
    if (allHit) {
      b.moving = false;
      setWon(true);
    }

    if (Math.hypot(b.vx, b.vy) < MIN_SPEED) {
      b.moving = false; b.vx = 0; b.vy = 0;
      b.x = center.current.x; b.y = center.current.y;
    }
  }, [won]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d")!;
    const lw = (canvas as any).__lw;
    const lh = (canvas as any).__lh;

    ctx.clearRect(0, 0, lw, lh);
    drawTable(ctx, lw, lh);
    targets.current.forEach((t) => drawBullseye(ctx, t.x, t.y, TARGET_RADIUS, t.hit));

    // --- RENDERIZADO DE LA RESORTERA (Slingshot) ---
    if (drag.current.active) {
      const b = ball.current;
      const dx = drag.current.current.x - drag.current.start.x;
      const dy = drag.current.current.y - drag.current.start.y;
      const power = Math.hypot(dx, dy);

      // Guía de puntería (bolitas blancas)
      if (power > 10) {
        const dirX = -dx / power; const dirY = -dy / power;
        for (let i = 1; i <= Math.floor(power / 12); i++) {
          ctx.fillStyle = `rgba(255,255,255,${(1 - i/10) * 0.4})`;
          ctx.beginPath(); ctx.arc(b.x + dirX * i * 18, b.y + dirY * i * 18, 3, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Bandas elásticas amarillas
      ctx.strokeStyle = "rgba(251,191,36,0.7)";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(center.current.x - 35, center.current.y); // Punto de anclaje izquierdo
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(center.current.x + 35, center.current.y); // Punto de anclaje derecho
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Dibujar bola
    drawCueBall(ctx, ball.current.x, ball.current.y, BALL_RADIUS);

    // Indicadores de la base (horquilla de la resortera)
    if (!ball.current.moving && !won) {
      ctx.fillStyle = "rgba(251,191,36,0.4)";
      ctx.beginPath(); ctx.arc(center.current.x - 35, center.current.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(center.current.x + 35, center.current.y, 4, 0, Math.PI * 2); ctx.fill();
    }
  }, [won]);

  const loop = useCallback((time: number) => {
    const dt = time - lastTime.current;
    lastTime.current = time;
    const steps = Math.min(Math.round(dt / 16), 4) || 1;
    for (let i = 0; i < steps; i++) tick();
    draw();
    animId.current = requestAnimationFrame(loop);
  }, [tick, draw]);

  useEffect(() => {
    if (!isMounted) return;
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    (canvas as any).__lw = rect.width;
    (canvas as any).__lh = rect.height;
    canvas.getContext("2d")!.scale(dpr, dpr);

    center.current = { x: rect.width / 2, y: rect.height * 0.75 };
    ball.current = { x: center.current.x, y: center.current.y, vx: 0, vy: 0, moving: false };

    if (targets.current.length === 0) {
      targets.current = [
        { x: rect.width * 0.2, y: rect.height * 0.15, hit: false },
        { x: rect.width * 0.5, y: rect.height * 0.25, hit: false },
        { x: rect.width * 0.8, y: rect.height * 0.15, hit: false },
      ];
    }

    lastTime.current = performance.now();
    animId.current = requestAnimationFrame(loop);

    const handleDown = (e: PointerEvent) => {
      if (ball.current.moving || won) return;
      const bRect = canvas.getBoundingClientRect();
      const pos = { x: e.clientX - bRect.left, y: e.clientY - bRect.top };
      if (dist(pos, ball.current) < BALL_RADIUS * 6) {
        drag.current = { active: true, start: {...pos}, current: {...pos} };
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const bRect = canvas.getBoundingClientRect();
      const pos = { x: e.clientX - bRect.left, y: e.clientY - bRect.top };
      const dx = pos.x - drag.current.start.x; const dy = pos.y - drag.current.start.y;
      const d = Math.hypot(dx, dy);
      if (d > MAX_DRAG) {
        pos.x = drag.current.start.x + (dx * MAX_DRAG) / d;
        pos.y = drag.current.start.y + (dy * MAX_DRAG) / d;
      }
      drag.current.current = pos;
      ball.current.x = center.current.x + (pos.x - drag.current.start.x);
      ball.current.y = center.current.y + (pos.y - drag.current.start.y);
    };

    const handleUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      const dx = drag.current.current.x - drag.current.start.x;
      const dy = drag.current.current.y - drag.current.start.y;
      if (Math.hypot(dx, dy) > 10) {
        ball.current.vx = -dx * LAUNCH_POWER; ball.current.vy = -dy * LAUNCH_POWER;
        ball.current.moving = true;
      } else {
        ball.current.x = center.current.x; ball.current.y = center.current.y;
      }
    };

    canvas.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      cancelAnimationFrame(animId.current);
      canvas.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isMounted, loop, won]);

  if (!isMounted) return <div className="w-full h-[320px] bg-slate-800 rounded-2xl animate-pulse"/>;

  return (
      <div className="relative w-full h-[320px] overflow-hidden border border-slate-700 shadow-lg" style={{background: "#3a2010"}}>
        {won && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-50 animate-fade-in pointer-events-auto">
              <h4 className="text-xl font-black text-slate-800 tracking-tight font-sans">¡Bien hecho!</h4>
              <button
                  onClick={() => {
                    targets.current = []; // Limpiar para que se regeneren
                    setWon(false);
                    onComplete();
                  }}
                  className="mt-4 px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm shadow-md active:scale-95 transition-all font-sans cursor-pointer"
              >
                Continuar
              </button>
            </div>
        )}
        <canvas ref={canvasRef} className="block w-full h-full" style={{touchAction: "none"}} />
        {!ball.current.moving && !won && (
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none" style={{bottom: 20}}>
              <span className="text-white/40 text-xs tracking-widest uppercase font-sans">Arrastra la bola y suelta</span>
            </div>
        )}
      </div>
  );
}