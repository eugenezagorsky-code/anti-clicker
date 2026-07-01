import {
  LEADERBOARD_MAX_ENTRIES,
  LEADERBOARD_STORAGE_KEY,
} from "@/lib/constants";
import {
  parseLeaderboardEntries,
  sortLeaderboardEntries,
} from "@/lib/leaderboardValidation";
import type { LeaderboardEntry } from "@/types/game";

function trimEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  if (entries.length <= LEADERBOARD_MAX_ENTRIES) {
    return entries;
  }
  return entries.slice(-LEADERBOARD_MAX_ENTRIES);
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return sortLeaderboardEntries(parseLeaderboardEntries(parsed));
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(
  entry: LeaderboardEntry,
): LeaderboardEntry[] {
  const updated = sortLeaderboardEntries(
    trimEntries([...loadLeaderboard(), entry]),
  );

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        LEADERBOARD_STORAGE_KEY,
        JSON.stringify(updated),
      );
    } catch {
      // Quota exceeded or private browsing — return in-memory list only
    }
  }

  return updated;
}
