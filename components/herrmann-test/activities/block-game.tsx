"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';

/* ================================================================
   TYPES
   ================================================================ */
interface Cell { row: number; col: number }

interface PieceDef {
    id: string;
    color: string;
    dark: string;
    light: string;
    cells: Cell[];
}

interface Placement {
    row: number;
    col: number;
}

interface DragInfo {
    pieceId: string;
    x: number;
    y: number;
}

interface HoverInfo {
    row: number;
    col: number;
    cells: Cell[];
    valid: boolean;
}

/* ================================================================
   CONSTANTS & NEW SHAPES (Fixed and aligned to 0,0)
   ================================================================ */
const GRID = 4;
const TRAY_CELL = 20; // px por celda en la bandeja

const PIECES: PieceDef[] = [
    {
        id: 'piece_1',
        color: '#FF6B6B',
        dark: '#CC4444',
        light: '#FF9999',
        //  #
        // ###
        cells: [
            { row: 1, col: 1 },
            { row: 2, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 0 },
        ],
    },
    {
        id: 'piece_2',
        color: '#4ECDC4',
        dark: '#36A89F',
        light: '#7EDDD6',
        // ##
        // #
        // #
        cells: [
            { row: 0, col: 0 }, { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
        ],
    },
    {
        id: 'piece_3',
        color: '#A78BFA',
        dark: '#7C5CFC',
        light: '#C4B5FD',
        // ##
        //  #
        cells: [
            { row: 0, col: 0 }, { row: 0, col: 1 },
            { row: 1, col: 1 },
        ],
    },
    {
        id: 'piece_4',
        color: '#FBBF24',
        dark: '#D4A017',
        light: '#FDE68A',
        // ##
        //  ##
        //   #
        cells: [
            { row: 0, col: 0 }, { row: 0, col: 1 },
            { row: 1, col: 1 }, { row: 1, col: 2 },
            { row: 2, col: 2 },
        ],
    },
];

const PIECE_MAP: Record<string, PieceDef> = {};
PIECES.forEach((p) => (PIECE_MAP[p.id] = p));

/* ================================================================
   HELPERS
   ================================================================ */
function pw(cells: Cell[]) {
    return Math.max(...cells.map((c) => c.col)) + 1;
}
function ph(cells: Cell[]) {
    return Math.max(...cells.map((c) => c.row)) + 1;
}

function buildGrid(placed: Record<string, Placement>): (string | null)[][] {
    const g: (string | null)[][] = Array.from({ length: GRID }, () =>
        Array(GRID).fill(null),
    );
    for (const [id, pl] of Object.entries(placed)) {
        const cells = PIECE_MAP[id].cells;
        for (const c of cells) {
            const rr = pl.row + c.row;
            const cc = pl.col + c.col;
            if (rr >= 0 && rr < GRID && cc >= 0 && cc < GRID) g[rr][cc] = id;
        }
    }
    return g;
}

/* ================================================================
   INTERFACE ADAPTATION
   ================================================================ */
interface BlocksProps {
    onComplete: () => void
}

export function BlockGame({ onComplete }: BlocksProps) {
    const [placed, setPlaced] = useState<Record<string, Placement>>({});
    const [drag, setDrag] = useState<DragInfo | null>(null);
    const [hover, setHover] = useState<HoverInfo | null>(null);
    const [won, setWon] = useState(false);

    const gridRef = useRef<HTMLDivElement>(null);

    /* derived grid */
    const grid = useMemo(() => buildGrid(placed), [placed]);

    /* win detection */
    useEffect(() => {
        if (Object.keys(placed).length === PIECES.length) {
            const full = grid.every((row) => row.every((c) => c !== null));
            if (full) {
                setWon(true);
            }
        }
    }, [placed, grid]);

    /* grid interaction helpers */
    const calcHover = useCallback(
        (cx: number, cy: number, pieceId: string): HoverInfo | null => {
            if (!gridRef.current) return null;
            const rect = gridRef.current.getBoundingClientRect();
            const cs = rect.width / GRID;
            const cells = PIECE_MAP[pieceId].cells;
            const h = ph(cells);
            const w = pw(cells);

            // Calculamos la celda origen basándonos en el centro geométrico de la pieza arrastrada
            // Posición de la pieza dentro de la grilla
            const gr = Math.round((cy - rect.top) / cs - h / 2);
            const gc = Math.round((cx - rect.left) / cs - w / 2);
            const abs = cells.map((c) => (
                { row: c.row + gr, col: c.col + gc })
            );

            const margin = cs * 1.2;
            if (
                cx < rect.left - margin ||
                cx > rect.right + margin ||
                cy < rect.top - margin ||
                cy > rect.bottom + margin
            )
                return null;

            const tempPlaced = { ...placed };
            delete tempPlaced[pieceId];
            const tempGrid = buildGrid(tempPlaced);

            const valid = abs.every(
                (c) =>
                    c.row >= 0 &&
                    c.row < GRID &&
                    c.col >= 0 &&
                    c.col < GRID &&
                    tempGrid[c.row][c.col] === null,
            );

            return { row: gr, col: gc, cells: abs, valid };
        },
        [placed],
    );

    /* pointer handlers */
    const startDrag = useCallback(
        (e: React.PointerEvent, pieceId: string) => {
            e.preventDefault();
            setPlaced((prev) => {
                const n = { ...prev };
                delete n[pieceId];
                return n;
            });
            const d: DragInfo = { pieceId, x: e.clientX, y: e.clientY };
            setDrag(d);
            setHover(calcHover(e.clientX, e.clientY, pieceId));
        },
        [calcHover],
    );

    const dragRef = useRef(drag);
    dragRef.current = drag;

    useEffect(() => {
        if (!drag) return;

        const onMove = (e: PointerEvent) => {
            e.preventDefault();
            setDrag((prev) =>
                prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
            );
            // Grid highlight
            setHover(calcHover(e.clientX, e.clientY, drag.pieceId));
        };

        const onUp = () => {
            const d = dragRef.current;
            if (!d) return;
            const h = calcHover(d.x, d.y, d.pieceId);
            if (h && h.valid) {
                setPlaced((prev) => ({
                    ...prev,
                    [d.pieceId]: { row: h.row, col: h.col },
                }));
            }
            setDrag(null);
            setHover(null);
        };

        window.addEventListener('pointermove', onMove, { passive: false });
        window.addEventListener('pointerup', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [drag?.pieceId, calcHover]);

    const handleContinue = () => {
        setPlaced({});
        setDrag(null);
        setHover(null);
        setWon(false);
        if (onComplete) onComplete();
    };

    const hoverSet = useMemo(() => {
        if (!hover) return new Set<string>();
        return new Set(hover.cells.map((c) => `${c.row},${c.col}`));
    }, [hover]);

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 select-none bg-slate-50 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">

            {/* CUADRILLA / GRID CONTENEDOR */}
            <div className="relative p-1 bg-slate-200 rounded-2xl border border-slate-300">
                <div
                    ref={gridRef}
                    style={{
                        width: 'min(72vw, 280px)',
                        aspectRatio: '1',
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID}, 1fr)`,
                        gridTemplateRows: `repeat(${GRID}, 1fr)`,
                        gap: 4,
                        touchAction: 'none',
                    }}
                >
                    {Array.from({ length: GRID * GRID }, (_, i) => {
                        const r = Math.floor(i / GRID);
                        const c = i % GRID;
                        const pieceId = grid[r][c];
                        const piece = pieceId ? PIECE_MAP[pieceId] : null;
                        const isHover = hoverSet.has(`${r},${c}`);
                        const isDraggedPiece = drag && pieceId === drag.pieceId;

                        let bg = '#e2e8f0'; // Fondo de celda vacía más claro
                        let shadow = 'none';
                        let border = '1px solid #cbd5e1';

                        if (piece && !isDraggedPiece) {
                            bg = piece.color;
                            shadow = `inset 0 1px 2px ${piece.light}, inset 0 -2px 4px ${piece.dark}`;
                            border = `1px solid ${piece.dark}`;
                        }

                        if (isHover && !isDraggedPiece) {
                            const dragPiece = drag ? PIECE_MAP[drag.pieceId] : null;
                            if (hover?.valid) {
                                bg = dragPiece ? dragPiece.color + 'aa' : '#22c55e66';
                                border = `2px solid ${dragPiece ? dragPiece.color : '#22c55e'}`;
                            } else {
                                bg = '#ef444466';
                                border = '2px solid #ef4444';
                            }
                        }

                        return (
                            <div
                                key={i}
                                className="rounded-xl transition-colors duration-100 cursor-pointer relative"
                                style={{
                                    background: bg,
                                    boxShadow: shadow,
                                    border,
                                }}
                                onPointerDown={(e) => {
                                    if (won) return;
                                    if (pieceId && !isDraggedPiece) {
                                        startDrag(e, pieceId);
                                    }
                                }}
                            >
                                {piece && !isDraggedPiece && (
                                    <div
                                        className="absolute inset-0 rounded-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${piece.light}22 0%, transparent 50%)`,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* OVERLAY DE "DESHABILITACIÓN" Y VICTORIA */}
                {won && (
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-4 text-center animate-fade-in z-20">
                        <span className="text-4xl mb-1"></span>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">
                            ¡Bien hecho!
                        </h4>
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="mt-4 px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
                        >
                            Continuar
                        </button>
                    </div>
                )}
            </div>

            {/* BANDEJA DE PIEZAS FIJAS (Sin botón rotar y más limpia) */}
            <div className="mt-5 grid grid-cols-2 gap-4 justify-center items-center w-full px-2">
                {PIECES.map((piece) => {
                    const isPlaced = piece.id in placed;
                    const isDragging = drag?.pieceId === piece.id;
                    const cellSet = new Set(piece.cells.map((c) => `${c.row},${c.col}`));
                    const gone = isPlaced || isDragging;

                    // Dimensiones de caja contenedora fija de 3x3 para centrar visualmente
                    return (
                        <div key={piece.id} className="flex justify-center items-center">
                            <div
                                className={`relative rounded-xl transition-all duration-200 bg-slate-100 p-2 border ${
                                    gone
                                        ? 'opacity-20 scale-90 border-slate-200'
                                        : 'opacity-100 cursor-grab hover:scale-102 active:scale-98 border-slate-300 shadow-sm'
                                }`}
                                style={{
                                    touchAction: 'none',
                                }}
                                onPointerDown={(e) => {
                                    if (won) return;
                                    if (!gone) {
                                        startDrag(e, piece.id);
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(3, ${TRAY_CELL}px)`,
                                        gridTemplateRows: `repeat(3, ${TRAY_CELL}px)`,
                                        gap: 2,
                                    }}
                                >
                                    {Array.from({ length: 9 }, (_, i) => {
                                        const rr = Math.floor(i / 3);
                                        const cc = i % 3;
                                        const filled = cellSet.has(`${rr},${cc}`);
                                        return (
                                            <div
                                                key={i}
                                                className="rounded-[4px]"
                                                style={{
                                                    background: filled ? piece.color : 'transparent',
                                                    border: filled ? `1px solid ${piece.dark}` : 'none',
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* DRAG GHOST (Sin efectos de brillo complejos) */}
            {drag && <DragGhost drag={drag} gridRef={gridRef} />}
        </div>
    );
}

/* ================================================================
   DRAG GHOST COMPONENT
   ================================================================ */
function DragGhost({
                       drag,
                       gridRef,
                   }: {
    drag: DragInfo;
    gridRef: React.RefObject<HTMLDivElement | null>;
}) {
    const piece = PIECE_MAP[drag.pieceId];
    const w = pw(piece.cells);
    const h = ph(piece.cells);
    const cellSet = new Set(piece.cells.map((c) => `${c.row},${c.col}`));

    const gridRect = gridRef.current?.getBoundingClientRect();
    const cs = gridRect ? gridRect.width / GRID : 65;

    const ghostW = w * cs;
    const ghostH = h * cs;

    const xOffset = -10;
    const yOffset = -100;

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{
                left: drag.x - ghostW / 2 + xOffset,
                top: drag.y - ghostH / 2 + yOffset,
                width: ghostW,
                height: ghostH,
                opacity: 0.85,
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${w}, 1fr)`,
                    gridTemplateRows: `repeat(${h}, 1fr)`,
                    gap: 3,
                    width: '100%',
                    height: '100%',
                }}
            >
                {Array.from({ length: w * h }, (_, i) => {
                    const rr = Math.floor(i / w);
                    const cc = i % w;
                    const filled = cellSet.has(`${rr},${cc}`);
                    return (
                        <div
                            key={i}
                            className="rounded-xl"
                            style={{
                                background: filled ? piece.color : 'transparent',
                                boxShadow: filled ? `inset 0 1px 2px ${piece.light}` : 'none',
                                border: filled ? `1.5px solid ${piece.dark}` : 'none',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}