import type { LeaderboardEntry, Metrics } from "@/types/game";

export const OPERATOR_NAME_MAX_LENGTH = 32;
export const MAX_ECOLOGICAL_DAMAGE_SCORE = 1e15;

function isValidMetrics(value: unknown): value is Metrics {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const m = value as Record<string, unknown>;
  return (
    typeof m.waterMl === "number" &&
    Number.isFinite(m.waterMl) &&
    typeof m.carbonKg === "number" &&
    Number.isFinite(m.carbonKg) &&
    typeof m.gridStress === "number" &&
    Number.isFinite(m.gridStress) &&
    typeof m.displacement === "number" &&
    Number.isFinite(m.displacement)
  );
}

export function isValidLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const e = value as Record<string, unknown>;
  return (
    typeof e.operatorName === "string" &&
    e.operatorName.length > 0 &&
    e.operatorName.length <= OPERATOR_NAME_MAX_LENGTH &&
    typeof e.ecologicalDamageScore === "number" &&
    Number.isFinite(e.ecologicalDamageScore) &&
    e.ecologicalDamageScore >= 0 &&
    e.ecologicalDamageScore <= MAX_ECOLOGICAL_DAMAGE_SCORE &&
    typeof e.totalClicks === "number" &&
    Number.isFinite(e.totalClicks) &&
    e.totalClicks >= 0 &&
    typeof e.completedAt === "string" &&
    isValidMetrics(e.metrics)
  );
}

export function parseLeaderboardEntries(raw: unknown): LeaderboardEntry[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(isValidLeaderboardEntry);
}

export function sortLeaderboardEntries(
  entries: LeaderboardEntry[],
): LeaderboardEntry[] {
  return [...entries].sort(
    (a, b) => b.ecologicalDamageScore - a.ecologicalDamageScore,
  );
}

export function normalizeLeaderboardEntry(
  value: unknown,
): LeaderboardEntry | null {
  if (!isValidLeaderboardEntry(value)) {
    return null;
  }
  return {
    operatorName: value.operatorName.trim(),
    ecologicalDamageScore: value.ecologicalDamageScore,
    totalClicks: value.totalClicks,
    completedAt: value.completedAt,
    metrics: { ...value.metrics },
  };
}
