"use client";

import { motion } from "framer-motion";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { gameoverCopy } from "@/content/gameover";
import { damageTierStyles, getDamageTier } from "@/lib/damageTier";
import { fadeInUp } from "@/lib/motion";
import {
  formatCompactNumber,
  formatDamageScore,
  formatDamageScoreFull,
} from "@/lib/scoreCalculator";
import type { LeaderboardEntry } from "@/types/game";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentEntryCompletedAt: string | null;
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort(
    (a, b) => b.ecologicalDamageScore - a.ecologicalDamageScore,
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getTierMarker(tier: ReturnType<typeof getDamageTier>): string | null {
  switch (tier) {
    case "pristine":
      return gameoverCopy.leaderboard.pristineMarker;
    case "partial":
      return gameoverCopy.leaderboard.partialMarker;
    case "severe":
      return null;
  }
}

export function LeaderboardTable({
  entries,
  currentEntryCompletedAt,
}: LeaderboardTableProps) {
  const sorted = sortEntries(entries);
  const cols = gameoverCopy.leaderboard.columns;
  const currentEntry = sorted.find(
    (e) => e.completedAt === currentEntryCompletedAt,
  );
  const currentTier = currentEntry
    ? getDamageTier(currentEntry.metrics, currentEntry.totalClicks)
    : null;

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="mt-8"
    >
      {sorted.length === 0 ? (
        <TerminalPanel
          className={`px-6 py-8 text-center text-sm ${
            currentTier === "pristine"
              ? "border-success-border text-success-dim"
              : currentTier === "partial"
                ? "border-warning-border text-warning-dim"
                : "text-text-muted"
          }`}
        >
          {currentTier === "pristine"
            ? gameoverCopy.leaderboard.emptyPristine
            : gameoverCopy.leaderboard.empty}
        </TerminalPanel>
      ) : (
        <TerminalPanel className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="w-[10%] px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                  {cols.rank}
                </th>
                <th className="w-[28%] px-4 py-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                  {cols.operator}
                </th>
                <th className="w-[22%] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {cols.damage}
                </th>
                <th className="w-[14%] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {cols.clicks}
                </th>
                <th className="w-[26%] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
                  {cols.date}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, index) => {
                const isCurrent =
                  currentEntryCompletedAt !== null &&
                  entry.completedAt === currentEntryCompletedAt;
                const tier = getDamageTier(entry.metrics, entry.totalClicks);
                const styles = damageTierStyles[tier];
                const marker = getTierMarker(tier);

                return (
                  <tr
                    key={entry.completedAt}
                    className={`border-b border-border last:border-b-0 ${
                      isCurrent ? styles.rowHighlight : styles.rowMuted
                    }`}
                  >
                    <td className="px-4 py-3 font-mono tabular-nums text-text-muted">
                      {index + 1}
                    </td>
                    <td
                      className={`max-w-0 truncate px-4 py-3 ${
                        isCurrent || tier !== "severe"
                          ? `font-medium ${styles.name}`
                          : "text-text"
                      }`}
                      title={entry.operatorName}
                    >
                      {entry.operatorName}
                      {isCurrent && (
                        <span className={`ml-2 text-xs ${styles.marker}`}>
                          {gameoverCopy.leaderboard.youMarker}
                        </span>
                      )}
                      {marker && !isCurrent && (
                        <span className={`ml-2 text-xs ${styles.marker} opacity-80`}>
                          {marker}
                        </span>
                      )}
                    </td>
                    <td
                      className={`max-w-0 truncate px-4 py-3 text-right font-mono tabular-nums ${styles.damage}`}
                      title={formatDamageScoreFull(entry.ecologicalDamageScore)}
                    >
                      {formatDamageScore(entry.ecologicalDamageScore)}
                    </td>
                    <td
                      className="max-w-0 truncate px-4 py-3 text-right font-mono tabular-nums text-text-muted"
                      title={formatDamageScoreFull(entry.totalClicks)}
                    >
                      {formatCompactNumber(entry.totalClicks)}
                    </td>
                    <td className="max-w-0 truncate px-4 py-3 text-right text-xs text-muted">
                      {formatDate(entry.completedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TerminalPanel>
      )}
    </motion.div>
  );
}
