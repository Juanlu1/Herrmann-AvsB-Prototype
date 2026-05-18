"use client"

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react"

// --- Configuración Global ---
const MAX_PRESSES = 20;
const DEFLATE_DELAY = 500; // Medio segundo sin presionar para empezar a desinflar
const DEFLATE_RATE = 1;  // Velocidad de desinflado (ms por cada unidad de tamaño)
const BALLOON_COLOR = "#FF6B6B";
const BALLOON_EXPAND_SCALE = 4; // Píxeles que crece por cada click

interface BalloonGameProps {
  onComplete: () => void
}

export function BalloonGame({ onComplete }: BalloonGameProps) {
  const [pressCount, setPressCount] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [won, setWon] = useState(false);

  const lastPressTime = useRef<number>(Date.now());
  const deflateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lógica de desinflado
  useEffect(() => {
    if (won || isExploded) return;

    deflateInterval.current = setInterval(() => {
      const timeSinceLastPress = Date.now() - lastPressTime.current;

      if (timeSinceLastPress > DEFLATE_DELAY) {
        setPressCount((prev) => {
          // Restamos una pequeña fracción para que el movimiento sea fluido
          // Si quieres que se desinfle más rápido, aumenta este 0.1
          const decrement = 0.1;
          return prev > 0 ? prev - decrement : 0;
        });
      }
    }, DEFLATE_RATE);

    return () => {
      if (deflateInterval.current) clearInterval(deflateInterval.current);
    };
  }, [won, isExploded]);

  // Manejador del botón
  const handlePress = useCallback(() => {
    if (won || isExploded) return;

    lastPressTime.current = Date.now();

    setPressCount((prev) => {
      const next = prev + 1;
      if (next >= MAX_PRESSES) {
        triggerExplosion();
        return MAX_PRESSES;
      }
      return next;
    });
  }, [won, isExploded]);

  const triggerExplosion = () => {
    setIsExploded(true);
    // Pequeño delay para ver el efecto antes de mostrar la pantalla de victoria
    setTimeout(() => {
      setWon(true);
    }, 400);

  };

  const handleContinue = () => {
    setWon(false);
    setIsExploded(false);
    setPressCount(0);
    if (onComplete) onComplete();
  };

  if (!isMounted) {
    return <div className="w-full h-[320px] bg-slate-100 rounded-2xl animate-pulse" />;
  }

  // Cálculo de estilo dinámico para el globo
  const balloonSize = 60 + (pressCount * BALLOON_EXPAND_SCALE);
  const progress = (pressCount / MAX_PRESSES) * 100;

  return (
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex flex-col items-center justify-between p-6">

        {/* Área del Globo */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          {!isExploded ? (
              <div
                  className="rounded-full shadow-lg transition-all duration-200 ease-out relative"
                  style={{
                    width: `${balloonSize}px`,
                    height: `${balloonSize * 1.1}px`,
                    backgroundColor: BALLOON_COLOR,
                    boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.1), 0 10px 20px rgba(255,107,107,0.2)`,
                  }}
              >
                {/* Reflejo de luz en el globo */}
                <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] bg-white/30 rounded-full blur-[2px]" />

                {/* Nudo del globo */}
                <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-3"
                    style={{
                      backgroundColor: BALLOON_COLOR,
                      clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
                    }}
                />
              </div>
          ) : (
              // Animación de estallido
              <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="bg-red-400 w-32 h-32 rounded-full absolute"
              />
          )}
        </div>

        {/* Interfaz de Control */}
        <div className="w-full space-y-4 flex flex-col items-center">
          {/* Barra de progreso sutil */}
          <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-red-400 transition-all" // Eliminamos duration-300
                style={{
                  width: `${progress}%`,
                  // Ajustamos la duración para que coincida exactamente con el rate de refresco
                  transitionDuration: `${DEFLATE_RATE}ms`,
                  transitionTimingFunction: 'linear'
                }}
            />
          </div>

          <button
              onMouseDown={handlePress}
              onTouchStart={handlePress}
              className="group relative px-10 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:border-red-300 active:scale-95 transition-all"
          >
            <span className="text-slate-700 font-bold tracking-tight">¡INFLAR!</span>
          </button>
        </div>

        {/* Pantalla de Victoria integrada */}
        {won && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-center z-50 animate-fade-in pointer-events-auto">
              <h4 className="text-xl font-black text-slate-800 tracking-tight">
                ¡Bien hecho!
              </h4>
              <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-4 px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                Continuar
              </button>
            </div>
        )}
      </div>
  )
}