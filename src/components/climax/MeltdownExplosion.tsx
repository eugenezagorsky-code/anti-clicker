"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { climaxCopy } from "@/content/climax";
import { overlayFade } from "@/lib/motion";

const EXPLOSION_DURATION_MS = 1200;

export function MeltdownExplosion() {
  const { dispatch } = useGame();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (hasTriggeredRef.current) {
        return;
      }
      hasTriggeredRef.current = true;
      dispatch({ type: "TRIGGER_KILL_SWITCH" });
    }, EXPLOSION_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <motion.div
      {...overlayFade}
      className="meltdown-shake fixed inset-0 z-[65] flex items-center justify-center overflow-hidden"
      aria-label={climaxCopy.meltdown.ariaLabel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0.9, 0],
          scale: [0.8, 1.4, 1.8, 2.2, 2.5],
        }}
        transition={{ duration: 1.2, times: [0, 0.15, 0.4, 0.7, 1], ease: "easeOut" }}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,68,68,0.95) 0%, rgba(232,168,56,0.7) 35%, rgba(0,11,30,0.95) 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 0] }}
        transition={{ duration: 1.2, times: [0, 0.1, 0.5, 1] }}
        className="absolute inset-0 bg-accent/20"
      />

      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1.05, 1.1] }}
        transition={{ duration: 1.2, times: [0, 0.2, 0.6, 1] }}
        className="relative z-10 text-center font-mono text-sm font-bold uppercase tracking-[0.4em] text-text crt-glow-text"
      >
        {climaxCopy.meltdown.headline}
      </motion.p>
    </motion.div>
  );
}
