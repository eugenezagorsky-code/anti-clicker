"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { dashboardCopy } from "@/content/dashboard";
import { useGameEngine } from "@/hooks/useGameEngine";
import { getIdleSecondsDisplay } from "@/lib/idleTimer";
import { buttonHover } from "@/lib/motion";

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function SessionDisconnectTimer() {
  const { state } = useGame();
  const { handleManualDisconnect } = useGameEngine();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getIdleSecondsDisplay(
      state.lastManualActivityAt,
      state.idleDisconnectPaused,
      state.idleDisconnectFrozenSeconds,
    ),
  );

  useEffect(() => {
    if (state.phase !== "active" || state.lastManualActivityAt === null) {
      return;
    }

    if (state.idleDisconnectPaused) {
      setSecondsLeft(
        getIdleSecondsDisplay(
          state.lastManualActivityAt,
          state.idleDisconnectPaused,
          state.idleDisconnectFrozenSeconds,
        ),
      );
      return;
    }

    const tick = () => {
      setSecondsLeft(
        getIdleSecondsDisplay(
          state.lastManualActivityAt,
          state.idleDisconnectPaused,
          state.idleDisconnectFrozenSeconds,
        ),
      );
    };

    tick();
    const intervalId = window.setInterval(tick, 100);
    return () => window.clearInterval(intervalId);
  }, [
    state.phase,
    state.lastManualActivityAt,
    state.idleDisconnectPaused,
    state.idleDisconnectFrozenSeconds,
  ]);

  if (state.phase !== "active") {
    return null;
  }

  const copy = dashboardCopy.sessionDisconnect;

  return (
    <motion.button
      type="button"
      onClick={handleManualDisconnect}
      {...buttonHover}
      className="flex items-center gap-1.5 border border-border bg-surface-raised px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted transition-colors hover:border-accent/50 hover:bg-surface-raised/80 hover:text-text"
      title={copy.title}
      aria-label={`${copy.label} ${formatCountdown(secondsLeft)}`}
    >
      <Power className="h-3 w-3 shrink-0" />
      <span>
        {copy.label} {formatCountdown(secondsLeft)}
      </span>
    </motion.button>
  );
}
