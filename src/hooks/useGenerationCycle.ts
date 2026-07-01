"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import { dashboardCopy } from "@/content/dashboard";
import { TICKER_MESSAGES } from "@/content/ticker";
import { getClickConsequence } from "@/lib/clickConsequences";
import { PAYWALL_CLICK, getGenerationDelayMs } from "@/lib/constants";
import type { ClickConsequence } from "@/types/game";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export type GenerationPhase = "idle" | "generating";

export type LogDisplayMode = "pinned" | "minimized";

export interface PendingConsequence {
  clickNumber: number;
  message: string;
  consequence: ClickConsequence;
  isPaywall: boolean;
}

function getDisplayMessage(clickNumber: number, isPaywall: boolean): string {
  if (isPaywall) {
    return dashboardCopy.consequence.paywallPreview;
  }
  return (
    TICKER_MESSAGES[clickNumber] ??
    getClickConsequence(clickNumber).tickerMessage.replace(
      /^Click \d+: /,
      "",
    )
  );
}

export function useGenerationCycle() {
  const { state, dispatch } = useGame();
  const { play } = useSoundEffects();
  const [phase, setPhase] = useState<GenerationPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [pending, setPending] = useState<PendingConsequence | null>(null);
  const [logDisplay, setLogDisplay] = useState<LogDisplayMode>("minimized");
  const timersRef = useRef<number[]>([]);
  const progressIntervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const isBusy = phase !== "idle";

  useEffect(() => {
    if (state.phase !== "active" && isBusy) {
      clearTimers();
      setPhase("idle");
      setPending(null);
      setLogDisplay("minimized");
      setProgress(0);
    }
  }, [state.phase, isBusy, clearTimers]);

  useEffect(() => {
    if (phase !== "generating") return;

    const intervalId = window.setInterval(() => {
      setStatusIndex(
        (i) => (i + 1) % dashboardCopy.generation.statuses.length,
      );
    }, 600);

    return () => window.clearInterval(intervalId);
  }, [phase]);

  const startGeneration = useCallback(() => {
    if (state.phase !== "active" || isBusy) return;

    play("generate");
    setLogDisplay("minimized");
    dispatch({ type: "GENERATION_STARTED" });

    const nextClick = state.clicks + 1;
    const isPaywall = nextClick === PAYWALL_CLICK;
    const consequence = isPaywall
      ? {
          metricsDelta: {},
          tickerMessage: dashboardCopy.consequence.paywallPreview,
        }
      : getClickConsequence(nextClick);

    const delayMs = getGenerationDelayMs(state.clicks);
    const startedAt = Date.now();

    setPending({
      clickNumber: nextClick,
      message: getDisplayMessage(nextClick, isPaywall),
      consequence,
      isPaywall,
    });
    setPhase("generating");
    setProgress(0);
    setStatusIndex(0);

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / delayMs) * 100));
    }, 50);

    const completeTimer = window.setTimeout(() => {
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);
      play("complete");
      dispatch({ type: "MANUAL_CLICK" });
      setPhase("idle");
      setLogDisplay("pinned");
      if (!isPaywall) {
        dispatch({ type: "GENERATION_COMPLETED" });
      }
    }, delayMs);
    timersRef.current.push(completeTimer);
  }, [state.phase, state.clicks, isBusy, dispatch, play]);

  const statusText =
    phase === "generating"
      ? dashboardCopy.generation.statuses[statusIndex]
      : null;

  return {
    phase,
    progress,
    statusText,
    pending,
    logDisplay,
    setLogDisplay,
    isBusy,
    startGeneration,
    intensityClickNumber: pending?.clickNumber ?? state.clicks + 1,
  };
}
