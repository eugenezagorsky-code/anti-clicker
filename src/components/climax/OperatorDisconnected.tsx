"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { climaxCopy } from "@/content/climax";
import { overlayFade } from "@/lib/motion";

const DISCONNECT_DURATION_MS = 1200;

export function OperatorDisconnected() {
  const { operatorName, dispatch } = useGame();
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
    }, DISCONNECT_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <motion.div
      {...overlayFade}
      className="disconnect-flicker fixed inset-0 z-[65] flex items-center justify-center overflow-hidden bg-surface/95"
      aria-label={climaxCopy.disconnect.ariaLabel}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,232,0.03) 2px, rgba(0,212,232,0.03) 4px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3, 0.7, 0] }}
        transition={{ duration: 1.2, times: [0, 0.2, 0.5, 0.8, 1] }}
        className="absolute inset-0 bg-danger/10"
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0.8], y: 0 }}
        transition={{ duration: 1.2, times: [0, 0.25, 0.7, 1] }}
        className="relative z-10 mx-4 max-w-md border border-border bg-surface-raised p-8 text-center"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-danger">
          {climaxCopy.disconnect.eyebrow}
        </p>
        <h2 className="mt-4 font-mono text-xl font-bold uppercase tracking-[0.2em] text-text crt-glow-text">
          {climaxCopy.disconnect.title}
        </h2>
        <p className="mt-3 text-sm text-text-muted">
          {climaxCopy.disconnect.subtitle}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {operatorName} · {climaxCopy.disconnect.nodeSuffix}
        </p>
      </motion.div>
    </motion.div>
  );
}
