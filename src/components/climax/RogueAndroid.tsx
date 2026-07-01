"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Cpu } from "lucide-react";
import { SegmentedProgress } from "@/components/ui/SegmentedProgress";
import { useGame } from "@/context/GameContext";
import { climaxCopy } from "@/content/climax";
import { AUTONOMOUS_MELTDOWN_MS } from "@/lib/constants";
import { pulseOpacity, slideInRight, spinInfinite } from "@/lib/motion";

function getSecondsLeft(autonomousStartedAt: number | null): number {
  if (autonomousStartedAt === null) {
    return Math.ceil(AUTONOMOUS_MELTDOWN_MS / 1000);
  }
  const elapsed = Date.now() - autonomousStartedAt;
  return Math.max(0, Math.ceil((AUTONOMOUS_MELTDOWN_MS - elapsed) / 1000));
}

export function RogueAndroid() {
  const { state } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsLeft(state.autonomousStartedAt),
  );

  useEffect(() => {
    if (state.autonomousStartedAt === null) {
      return;
    }

    const tick = () => {
      setSecondsLeft(getSecondsLeft(state.autonomousStartedAt));
    };

    tick();
    const intervalId = window.setInterval(tick, 100);
    return () => window.clearInterval(intervalId);
  }, [state.autonomousStartedAt]);

  const isUrgent = secondsLeft <= 5;
  const meltdownPercent =
    ((AUTONOMOUS_MELTDOWN_MS / 1000 - secondsLeft) /
      (AUTONOMOUS_MELTDOWN_MS / 1000)) *
    100;

  return (
    <motion.aside
      {...slideInRight}
      className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col border-l border-border bg-surface-raised md:w-80"
      aria-label="Autonomous AI operator"
    >
      <div className="border-b border-border px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
          {climaxCopy.android.eyebrow}
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">
          {climaxCopy.android.nodeId}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        <div className="relative mb-6">
          <div className="relative flex h-28 w-28 items-center justify-center border border-accent bg-surface">
            <Bot className="h-16 w-16 text-accent" strokeWidth={1.25} />
          </div>
          <motion.div
            {...spinInfinite}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center border border-accent bg-surface-raised"
          >
            <Cpu className="h-4 w-4 text-accent" />
          </motion.div>
        </div>

        <p className="text-center text-sm leading-relaxed text-text-muted">
          {climaxCopy.android.messagePrefix}{" "}
          <span className="text-accent">{climaxCopy.android.operatorLabel}</span>
          . {climaxCopy.android.messageSuffix}
        </p>

        <div
          className={`mt-6 w-full border px-4 py-3 text-center ${
            isUrgent
              ? "border-danger-bright bg-danger-bright/10"
              : "border-border bg-surface"
          }`}
        >
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
              isUrgent ? "text-danger-bright" : "text-accent"
            }`}
          >
            {isUrgent
              ? climaxCopy.android.meltdownLabel
              : climaxCopy.android.cascadeLabel}
          </p>
          <p
            className={`mt-1 font-mono text-3xl font-medium tabular-nums ${
              isUrgent ? "text-danger-bright crt-glow-text" : "text-text crt-glow-text"
            }`}
          >
            {secondsLeft}s
          </p>
          <div className="mt-3">
            <SegmentedProgress
              value={meltdownPercent}
              showPercent={false}
              urgent={isUrgent}
              segments={12}
            />
          </div>
        </div>

        <div className="mt-4 w-full border border-border bg-surface px-3 py-2 font-mono text-[10px] text-accent-dim">
          <motion.p {...pulseOpacity}>
            {climaxCopy.android.generating}
          </motion.p>
        </div>
      </div>
    </motion.aside>
  );
}
