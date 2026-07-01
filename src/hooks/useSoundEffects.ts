"use client";

import { useCallback, useMemo } from "react";
import { playSound, resumeAudio, type SoundId } from "@/lib/soundEffects";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useSoundEffects() {
  const play = useCallback((id: SoundId) => {
    if (prefersReducedMotion()) return;
    resumeAudio();
    playSound(id);
  }, []);

  return useMemo(() => ({ play }), [play]);
}
