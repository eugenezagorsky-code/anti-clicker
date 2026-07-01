"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DoNotPressButton } from "@/components/dashboard/DoNotPressButton";
import { GenerationProgress } from "@/components/dashboard/GenerationProgress";
import { useGame } from "@/context/GameContext";
import { dashboardCopy } from "@/content/dashboard";
import { useGameEngine } from "@/hooks/useGameEngine";
import { generationPulse, getIntensityTier } from "@/lib/motion/presets";

interface GenerationStageProps {
  phase: "idle" | "generating";
  progress: number;
  statusText: string | null;
  isBusy: boolean;
  intensityClickNumber: number;
  startGeneration: () => void;
}

export function GenerationStage({
  phase,
  progress,
  statusText,
  isBusy,
  intensityClickNumber,
  startGeneration,
}: GenerationStageProps) {
  const { state } = useGame();
  const { canManualClick, isAutonomous } = useGameEngine();

  const tier = getIntensityTier(intensityClickNumber);
  const showProgress = phase === "generating";
  const buttonEnabled = canManualClick && !isBusy;

  return (
    <div className="flex flex-col items-center border-b border-border px-6 py-10">
      {isAutonomous && state.tickerEvents.length > 0 && (
        <AutonomousBurst lastEvent={state.tickerEvents[state.tickerEvents.length - 1]} />
      )}

      <motion.div
        {...(showProgress ? generationPulse(tier) : {})}
        className="w-full max-w-md"
      >
        <DoNotPressButton
          onClick={startGeneration}
          disabled={!buttonEnabled}
          burstEnabled={!showProgress && buttonEnabled}
          label={
            showProgress
              ? dashboardCopy.generation.progressLabel
              : dashboardCopy.generateButton.label
          }
        />
      </motion.div>

      {canManualClick && !showProgress && (
        <p className="mt-3 max-w-md px-4 text-center text-[10px] text-text-muted">
          {dashboardCopy.generateButton.sublabel}
        </p>
      )}

      {showProgress && (
        <GenerationProgress progress={progress} statusText={statusText} />
      )}
    </div>
  );
}

function AutonomousBurst({ lastEvent }: { lastEvent: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={lastEvent}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="mb-4 max-w-lg px-4 text-center font-mono text-[10px] text-accent-dim"
      >
        <span className="text-accent">&gt;</span> {lastEvent.replace(/^Click \d+: /, "")}
      </motion.p>
    </AnimatePresence>
  );
}
