"use client";

import { motion } from "framer-motion";
import { TerminalButton } from "@/components/ui/TerminalButton";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { DamageSummary } from "@/components/gameover/DamageSummary";
import { LeaderboardTable } from "@/components/gameover/LeaderboardTable";
import { useGame } from "@/context/GameContext";
import { gameoverCopy } from "@/content/gameover";
import { damageTierStyles, getDamageTier } from "@/lib/damageTier";
import { calculateEcologicalDamageScore } from "@/lib/scoreCalculator";
import { fadeInSlow } from "@/lib/motion";

function getTitle(tier: ReturnType<typeof getDamageTier>): string {
  switch (tier) {
    case "pristine":
      return gameoverCopy.titlePristine;
    case "partial":
      return gameoverCopy.titlePartial;
    case "severe":
      return gameoverCopy.title;
  }
}

export function RegistryOfShame() {
  const {
    operatorName,
    metrics,
    clicks,
    state,
    dispatch,
    currentEntryCompletedAt,
  } = useGame();

  const ecologicalDamageScore = calculateEcologicalDamageScore(metrics, clicks);
  const tier = getDamageTier(metrics, clicks);
  const styles = damageTierStyles[tier];

  return (
    <motion.div
      {...fadeInSlow}
      className="flex min-h-screen flex-col items-center bg-surface px-4 py-6 md:px-6 md:py-8"
    >
      <div className="w-full max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className={`text-2xl font-medium ${styles.title}`}>
            {getTitle(tier)}
          </h1>
        </header>

        <TerminalPanel className={styles.outerPanel || undefined}>
          <div className="px-6 py-8 md:px-10 md:py-10">
            <DamageSummary
              operatorName={operatorName}
              metrics={metrics}
              clicks={clicks}
              ecologicalDamageScore={ecologicalDamageScore}
            />

            <LeaderboardTable
              entries={state.leaderboard}
              currentEntryCompletedAt={currentEntryCompletedAt}
            />

            <div className="mt-8 flex justify-center">
              <TerminalButton
                variant={styles.button}
                onClick={() => dispatch({ type: "RESET_GAME" })}
              >
                {gameoverCopy.playAgain}
              </TerminalButton>
            </div>
          </div>
        </TerminalPanel>
      </div>
    </motion.div>
  );
}
