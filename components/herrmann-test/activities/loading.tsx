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

    function Confetti() {
        const CONFETTI_COUNT_PER_SIDE = 50;
        const CONFETTI_MIN_SIZE = 5;
        const CONFETTI_MAX_SIZE = 15;
        const CONFETTI_SPREAD_X = 300;
        const CONFETTI_FALL_DISTANCE = 500;
        const CONFETTI_DURATION_MIN = 1.8;
        const CONFETTI_DURATION_MAX = 3.2;
        const CONFETTI_ROTATION = 720;

        const CONFETTI_COLORS = [
            "bg-primary",
            "bg-muted"
        ];

        const particles = useMemo(() => {
            return [...Array(CONFETTI_COUNT_PER_SIDE * 2)].map((_, i) => {
                const leftSide = i < CONFETTI_COUNT_PER_SIDE;

                return {
                    id: i,
                    side: leftSide ? "left" : "right",
                    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                    size: CONFETTI_MIN_SIZE + Math.random() * (CONFETTI_MAX_SIZE - CONFETTI_MIN_SIZE),
                    yStart: Math.random() * 200 + 100,
                    xOffset: Math.random() * CONFETTI_SPREAD_X,
                    duration: CONFETTI_DURATION_MIN + Math.random() * (CONFETTI_DURATION_MAX - CONFETTI_DURATION_MIN),
                    delay: Math.random() * 0.4,
                    rotation: (Math.random() > 0.5 ? 1 : -1) * CONFETTI_ROTATION
                };
            });
        }, []);

        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className={`absolute rounded-[2px] ${particle.color}`}
                        style={{
                            width: particle.size,
                            height: particle.size * 0.6,
                            left: particle.side === "left" ? 0 : undefined,
                            right: particle.side === "right" ? 0 : undefined,
                            top: particle.yStart,
                        }}
                        initial={{x: particle.side === "left" ? -20 : 20, y: 0, opacity: 0, rotate: 0}}
                        animate={{
                            x: particle.side === "left" ? particle.xOffset : -particle.xOffset,
                            y: CONFETTI_FALL_DISTANCE,
                            opacity: [0, 1, 1, 0],
                            rotate: particle.rotation,
                        }}
                        transition={{duration: particle.duration, delay: particle.delay, ease: "easeOut"}}
                    />
                ))}
            </div>
        );
    }

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
            animate={completed ? {x: "-100vw", opacity: 0} : {x: 0, opacity: 1}}
            transition={{
                duration: 0.4,
                ease: "easeInOut",
            }}
        >

            <Confetti/>

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
                        {progreso + 1} preguntas de {total} respondidas
                    </p>
                </div>
            </div>

            {/* Hint inferior */}
            <motion.div
                className="absolute bottom-10 flex items-center gap-2 text-sm font-bold"
                animate={{x: [0, -10, 0]}}
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