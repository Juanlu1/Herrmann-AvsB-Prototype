"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// --- Configuración ---
const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const IMAGE_URL = "/images/q21-b.jpg";

interface ImageGameProps {
  onComplete: () => void
}

export function ImageGame({ onComplete }: ImageGameProps) {
  const [rotations, setRotations] = useState<number[]>(new Array(TOTAL_PIECES).fill(0));
  const [isMounted, setIsMounted] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Mezclamos el puzzle con rotaciones iniciales
    const initialRotations = new Array(TOTAL_PIECES).fill(0).map((_, i) => {
      const piecesToRotate = [1, 3, 4, 7];
      if (piecesToRotate.includes(i)) {
        const possibleRots = [90, 180, 270];
        return possibleRots[Math.floor(Math.random() * possibleRots.length)];
      }
      return 0;
    });
    setRotations(initialRotations);
  }, []);

  useEffect(() => {
    if (!isMounted || won) return;
    const isSolved = rotations.every(rot => rot % 360 === 0);
    if (isSolved) {
      setWon(true);
    }
  }, [rotations, isMounted, won]);

  const handlePieceClick = (index: number) => {
    if (won) return;
    setRotations(prev => {
      const next = [...prev];
      next[index] += 90;
      return next;
    });
  };

  const handleContinue = () => {
    if (onComplete) onComplete();
  };

  if (!isMounted) return <div className="w-full h-[350px] bg-slate-100 animate-pulse rounded-2xl" />;

  return (
      <div className="relative w-full max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-slate-700 font-sans tracking-tight">Restaura la imagen</h3>
          <p className="text-xs text-slate-500 font-sans">Toca las piezas para rotarlas</p>
        </div>

        {/* Contenedor del Puzzle - Eliminado el gap y el padding para unión total */}
        <div className="relative aspect-square w-full grid grid-cols-3 bg-slate-200 rounded-xl overflow-hidden shadow-inner">
          {rotations.map((rotation, i) => {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;

            return (
                <motion.div
                    key={i}
                    onClick={() => handlePieceClick(i)}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    className="cursor-pointer bg-no-repeat"
                    style={{
                      backgroundImage: `url(${IMAGE_URL})`,
                      backgroundSize: "300% 300%",
                      // backgroundPosition preciso para unión perfecta
                      backgroundPosition: `${(col * 100) / (GRID_SIZE - 1)}% ${(row * 100) / (GRID_SIZE - 1)}%`,
                      // Aseguramos que no haya bordes ni espacios
                      border: "none",
                      outline: "none"
                    }}
                />
            );
          })}

          {/* Overlay de Victoria */}
          <AnimatePresence>
            {won && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20 pointer-events-auto"
                >
                  <h4 className="text-xl font-black text-slate-800 tracking-tight font-sans">
                    ¡Bien hecho!
                  </h4>
                  <button
                      type="button"
                      onClick={handleContinue}
                      className="mt-5 px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95 font-sans"
                  >
                    Continuar
                  </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  )
}