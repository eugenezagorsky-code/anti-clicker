"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { GamePhase, Metrics } from "@/types/game";
import { decayThresholds } from "@/theme/tokens";

export interface DecayEffects {
  className: string;
  style: CSSProperties;
}

const CLIMAX_PHASES: GamePhase[] = ["autonomous", "meltdown", "disconnected"];

function isClimaxPhase(phase: GamePhase): boolean {
  return CLIMAX_PHASES.includes(phase);
}

export function useDecayEffects(
  metrics: Metrics,
  phase: GamePhase,
): DecayEffects {
  const { gridStress, carbonKg, waterMl } = metrics;
  const { gridStress: gridT, carbonKg: carbonT, waterMl: waterT, maxBlurPx } =
    decayThresholds;

  const climax = isClimaxPhase(phase);

  let grayscale = 0;
  let blur = 0;
  let opacity = 1;
  let shake = false;

  if (climax) {
    if (gridStress > gridT.lightGrayscale) {
      grayscale = 0.3;
    }
    if (gridStress > gridT.heavyGrayscale) {
      grayscale = 0.6;
      opacity = 0.85;
    }
    if (carbonKg > carbonT.lightBlur) {
      blur = 1;
    }
    if (carbonKg > carbonT.heavyBlur) {
      blur = 3;
      opacity = Math.min(opacity, 0.8);
    }
    if (waterMl > waterT.shake) {
      shake = true;
    }
    blur = Math.min(blur, maxBlurPx);
  }

  const className = shake ? "decay-shake" : "";
  const style: CSSProperties = climax
    ? { filter: `blur(${blur}px) grayscale(${grayscale})`, opacity }
    : { filter: "none", opacity: 1 };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--decay-blur",
      climax ? `${blur}px` : "0px",
    );
    document.documentElement.style.setProperty(
      "--decay-grayscale",
      climax ? String(grayscale) : "0",
    );
    document.documentElement.style.setProperty(
      "--decay-opacity",
      climax ? String(opacity) : "1",
    );
  }, [climax, blur, grayscale, opacity]);

  return { className, style };
}
