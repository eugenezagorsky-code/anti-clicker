"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { TerminalButton } from "@/components/ui/TerminalButton";
import { doNotPressHover } from "@/lib/motion/presets";

const MAX_MARKS = 10;
const SPAWN_INTERVAL_MS = 120;
const SIZE_CLASSES = ["text-xs", "text-sm", "text-base", "text-lg"] as const;

type Edge = "top" | "right" | "bottom" | "left";

interface ExclamationMark {
  id: string;
  edge: Edge;
  along: number;
  outward: number;
  rotate: number;
  sizeClass: (typeof SIZE_CLASSES)[number];
  driftX: number;
  driftY: number;
  duration: number;
}

interface DoNotPressButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  burstEnabled: boolean;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createMark(): ExclamationMark {
  const edges: Edge[] = ["top", "right", "bottom", "left"];
  return {
    id: crypto.randomUUID(),
    edge: edges[Math.floor(Math.random() * edges.length)],
    along: randomBetween(0.15, 0.85),
    outward: randomBetween(12, 40),
    rotate: randomBetween(-25, 25),
    sizeClass: SIZE_CLASSES[Math.floor(Math.random() * SIZE_CLASSES.length)],
    driftX: randomBetween(-8, 8),
    driftY: randomBetween(-12, -4),
    duration: randomBetween(0.4, 0.7),
  };
}

function getMarkPosition(mark: ExclamationMark): {
  left: string;
  top: string;
  translate: string;
} {
  const along = `${mark.along * 100}%`;
  const outward = `${mark.outward}px`;

  switch (mark.edge) {
    case "top":
      return { left: along, top: "0", translate: `translate(-50%, calc(-100% - ${outward}))` };
    case "right":
      return { left: "100%", top: along, translate: `translate(calc(${outward}), -50%)` };
    case "bottom":
      return { left: along, top: "100%", translate: `translate(-50%, ${outward})` };
    case "left":
      return { left: "0", top: along, translate: `translate(calc(-100% - ${outward}), -50%)` };
  }
}

export function DoNotPressButton({
  label,
  onClick,
  disabled,
  burstEnabled,
}: DoNotPressButtonProps) {
  const [marks, setMarks] = useState<ExclamationMark[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spawnMark = useCallback(() => {
    setMarks((prev) => {
      const next = [...prev, createMark()];
      return next.length > MAX_MARKS ? next.slice(-MAX_MARKS) : next;
    });
  }, []);

  const clearSpawnInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!burstEnabled || disabled) return;
    setIsHovering(true);
    spawnMark();
    clearSpawnInterval();
    intervalRef.current = setInterval(spawnMark, SPAWN_INTERVAL_MS);
  }, [burstEnabled, disabled, spawnMark, clearSpawnInterval]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    clearSpawnInterval();
    setMarks([]);
  }, [clearSpawnInterval]);

  useEffect(() => {
    return () => clearSpawnInterval();
  }, [clearSpawnInterval]);

  const showBurst = burstEnabled && !disabled && isHovering;

  return (
    <div
      className="relative w-full overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {showBurst &&
          marks.map((mark) => {
            const pos = getMarkPosition(mark);
            return (
              <div
                key={mark.id}
                className="pointer-events-none absolute z-10"
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: pos.translate,
                }}
              >
                <motion.span
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: mark.rotate - 10,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.1, 1, 0.3],
                    rotate: mark.rotate,
                    x: mark.driftX,
                    y: mark.driftY,
                  }}
                  exit={{ opacity: 0, scale: 0.2 }}
                  transition={{ duration: mark.duration, ease: "easeOut" }}
                  className={`block select-none font-mono font-bold text-danger-bright ${mark.sizeClass}`}
                >
                  !
                </motion.span>
              </div>
            );
          })}
      </AnimatePresence>

      <TerminalButton
        onClick={onClick}
        disabled={disabled}
        size="default"
        variant="danger"
        className="w-full hover:bg-danger-bright/5 hover:shadow-none"
        {...(burstEnabled ? doNotPressHover : {})}
      >
        {label}
      </TerminalButton>
    </div>
  );
}
