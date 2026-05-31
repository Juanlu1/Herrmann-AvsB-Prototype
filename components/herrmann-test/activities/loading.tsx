import { useMemo, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ProgressSlideProps {
  total: number;
  progreso: number;
  onComplete: () => void;
}

export function ProgressSlide({ total, progreso, onComplete }: ProgressSlideProps) {
  const [completed, setCompleted] = useState(false);

  const percentage = useMemo(() => {
    if (total <= 0) return 0;
    return Math.min((progreso / total) * 100, 100);
  }, [progreso, total]);

  const handleDragEnd = (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
  ) => {
    const threshold = -120;

    if (info.offset.x < threshold) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
      <motion.div
          className="bg-background font-sans text-primary w-full min-h-screen flex flex-col items-center justify-center px-6 select-none overflow-hidden"
          drag="x"
          dragConstraints={{left: 0, right: 0}}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={ completed ? { x: "-100vw", opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
      >
        {/* Contenido principal */}
        <div className="flex items-center gap-6">
          {/* Barra vertical */}
          <div className="relative w-8 h-32 rounded-full bg-muted overflow-hidden">
            <motion.div
                className="absolute bottom-0 left-0 w-full bg-primary"
                initial={{height: 0}}
                animate={{height: `${percentage}%`}}
                transition={{
                  duration: percentage / total,
                  ease: "easeInOut",
                }}
            />
          </div>

          {/* Texto */}
          <div className="max-w-45">
            <p className="text-lg font-medium leading-tight">
              {progreso + 1} bloques de {total} completados
            </p>
          </div>
        </div>

        {/* Hint inferior */}
        <motion.div
            className="absolute bottom-10 flex items-center gap-2 text-sm font-bold"
            animate={{ x: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
        >
          <ArrowLeft size={18}/>
          <span>Desliza a la izquierda para continuar</span>
        </motion.div>
      </motion.div>
  );
}