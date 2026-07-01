"use client";

import { motion } from "framer-motion";
import { CarbonDebtPaywall } from "@/components/climax/CarbonDebtPaywall";
import { KillSwitch } from "@/components/climax/KillSwitch";
import { MeltdownExplosion } from "@/components/climax/MeltdownExplosion";
import { OperatorDisconnected } from "@/components/climax/OperatorDisconnected";
import { RogueAndroid } from "@/components/climax/RogueAndroid";
import { useGame } from "@/context/GameContext";
import { dashboardCopy } from "@/content/dashboard";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { GenerationStage } from "@/components/dashboard/GenerationStage";
import { MetricsStrip } from "@/components/dashboard/MetricsStrip";
import { SessionDisconnectTimer } from "@/components/dashboard/SessionDisconnectTimer";
import { useDecayEffects } from "@/hooks/useDecayEffects";
import { useGenerationCycle } from "@/hooks/useGenerationCycle";
import { useGameEngine } from "@/hooks/useGameEngine";
import { fadeInSlow } from "@/lib/motion";

export function CommandDashboard() {
  const { operatorName, metrics, state } = useGame();
  const { showPaywall, showRogueAndroid, showKillSwitch, isMeltdown, isDisconnected } =
    useGameEngine();
  const decay = useDecayEffects(metrics, state.phase);
  const generationCycle = useGenerationCycle();

  const statusKey = isDisconnected
    ? "disconnected"
    : showRogueAndroid
      ? "autonomous"
      : "active";

  const statusColor = isDisconnected
    ? "text-danger"
    : showRogueAndroid
      ? "text-accent"
      : "text-accent";

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center bg-surface px-4 py-6 md:px-6 md:py-8 ${
        showRogueAndroid ? "pr-72 md:pr-80" : ""
      }`}
    >
      <motion.div
        {...fadeInSlow}
        initial={false}
        style={decay.style}
        className={`flex w-full flex-col items-center ${decay.className}`}
      >
        <div className="w-full max-w-4xl border border-border">
          <div
            aria-hidden="true"
            className="flex select-none items-center justify-between gap-4 border-b border-border px-4 py-1.5 pointer-events-none"
          >
            <span className="text-[9px] uppercase tracking-[0.35em] text-accent/25">
              //
            </span>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {dashboardCopy.navDecorations.map((item, index) => (
                <span
                  key={item.code}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
                    index === 0 ? "text-accent/45" : "text-text-muted/45"
                  }`}
                >
                  {item.prefix}
                  <span className={index === 0 ? "crt-glow-text" : ""}>
                    {item.code}
                  </span>
                  {item.suffix}
                </span>
              ))}
            </div>
            <span className="font-mono text-[9px] tabular-nums tracking-wider text-text-muted/30">
              0x7F
            </span>
          </div>

          <header className="relative border-b border-border px-6 py-4 text-center">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <SessionDisconnectTimer />
            </div>
            <p className="text-xs font-medium uppercase tracking-corporate text-text-muted">
              {dashboardCopy.header.eyebrow}
            </p>
            <h1 className="mt-2 text-sm font-medium tracking-wide text-text-muted">
              {dashboardCopy.header.operatorPrefix}{" "}
              <span className="text-text crt-glow-text">{operatorName}</span>
              <span className="mx-2 text-muted">·</span>
              <span className={statusColor}>
                {dashboardCopy.header.status[statusKey]}
              </span>
            </h1>
          </header>

          <MetricsStrip metrics={metrics} />

          <GenerationStage
            phase={generationCycle.phase}
            progress={generationCycle.progress}
            statusText={generationCycle.statusText}
            isBusy={generationCycle.isBusy}
            intensityClickNumber={generationCycle.intensityClickNumber}
            startGeneration={generationCycle.startGeneration}
          />

          <ActivityLog
            events={state.tickerEvents}
            pending={generationCycle.pending}
            logDisplay={generationCycle.logDisplay}
            onLogDisplayChange={generationCycle.setLogDisplay}
          />
        </div>
      </motion.div>

      {showPaywall && <CarbonDebtPaywall />}
      {showRogueAndroid && <RogueAndroid />}
      {showKillSwitch && <KillSwitch />}
      {isMeltdown && <MeltdownExplosion />}
      {isDisconnected && <OperatorDisconnected />}
    </div>
  );
}
