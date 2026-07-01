import {
  isValidLeaderboardEntry,
  parseLeaderboardEntries,
} from "@/lib/leaderboardValidation";
import { loadLeaderboard, saveLeaderboardEntry } from "@/lib/storage";
import type { LeaderboardEntry } from "@/types/game";

const LEADERBOARD_API = "/api/leaderboard";

async function parseResponseEntries(response: Response): Promise<LeaderboardEntry[]> {
  const data: unknown = await response.json();
  if (Array.isArray(data)) {
    return parseLeaderboardEntries(data);
  }
  if (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as { entries?: unknown }).entries)
  ) {
    return parseLeaderboardEntries((data as { entries: unknown[] }).entries);
  }
  return [];
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(LEADERBOARD_API, { cache: "no-store" });
    if (!response.ok) {
      return loadLeaderboard();
    }
    return await parseResponseEntries(response);
  } catch {
    return loadLeaderboard();
  }
}

export async function submitLeaderboardEntry(
  entry: LeaderboardEntry,
): Promise<LeaderboardEntry[]> {
  if (!isValidLeaderboardEntry(entry)) {
    return saveLeaderboardEntry(entry);
  }

  try {
    const response = await fetch(LEADERBOARD_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      return saveLeaderboardEntry(entry);
    }

    return await parseResponseEntries(response);
  } catch {
    return saveLeaderboardEntry(entry);
  }
}
