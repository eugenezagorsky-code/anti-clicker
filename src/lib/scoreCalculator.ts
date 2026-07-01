import type { Metrics } from "@/types/game";

export function calculateEcologicalDamageScore(
  metrics: Metrics,
  clicks: number,
): number {
  return (
    metrics.waterMl * 0.01 +
    metrics.carbonKg * 10 +
    metrics.gridStress * 5 +
    metrics.displacement * 100 +
    clicks * 50
  );
}

/** True when the session caused no ecological harm (idle exit, zero clicks, zero metrics). */
export function hasEcologicalDamage(
  metrics: Metrics,
  clicks: number,
): boolean {
  return calculateEcologicalDamageScore(metrics, clicks) > 0;
}

/** Suffix tiers for compact display (thousands grouping). */
const COMPACT_SUFFIXES = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "Dc",
  "Ud",
  "Dd",
  "Td",
  "Qad",
  "Qid",
] as const;

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d)0$/, "$1");
}

/** Compact table display (e.g. 1.53M, 153 Qad) — never scientific notation. */
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  if (value === 0) {
    return "0";
  }

  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs < 1_000_000) {
    return sign + abs.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  const tier = Math.floor(Math.log10(abs) / 3);
  if (tier >= COMPACT_SUFFIXES.length) {
    return (
      sign + abs.toLocaleString(undefined, { maximumFractionDigits: 0 })
    );
  }

  const scaled = abs / 10 ** (tier * 3);
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  const formatted = trimTrailingZeros(scaled.toFixed(digits));

  return `${sign}${formatted}${COMPACT_SUFFIXES[tier]}`;
}

/** Compact display for leaderboard cells; full value available via title/tooltip. */
export function formatDamageScore(score: number): string {
  return formatCompactNumber(score);
}

export function formatDamageScoreFull(score: number): string {
  if (!Number.isFinite(score)) {
    return "—";
  }
  return score.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
