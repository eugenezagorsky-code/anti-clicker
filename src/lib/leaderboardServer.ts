import { kv } from "@vercel/kv";
import {
  LEADERBOARD_MAX_ENTRIES,
  LEADERBOARD_STORAGE_KEY,
} from "@/lib/constants";
import {
  parseLeaderboardEntries,
  sortLeaderboardEntries,
} from "@/lib/leaderboardValidation";
import type { LeaderboardEntry } from "@/types/game";

export function isKvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

function trimEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  if (entries.length <= LEADERBOARD_MAX_ENTRIES) {
    return entries;
  }
  return entries.slice(-LEADERBOARD_MAX_ENTRIES);
}

export async function getLeaderboardFromKv(): Promise<LeaderboardEntry[]> {
  if (!isKvConfigured()) {
    return [];
  }

  try {
    const raw = await kv.get<unknown>(LEADERBOARD_STORAGE_KEY);
    if (raw === null || raw === undefined) {
      return [];
    }
    return sortLeaderboardEntries(parseLeaderboardEntries(raw));
  } catch {
    return [];
  }
}

export async function appendLeaderboardEntry(
  entry: LeaderboardEntry,
): Promise<LeaderboardEntry[]> {
  if (!isKvConfigured()) {
    throw new Error("KV not configured");
  }

  const existing = parseLeaderboardEntries(
    await kv.get<unknown>(LEADERBOARD_STORAGE_KEY),
  );
  const updated = sortLeaderboardEntries(
    trimEntries([...existing, entry]),
  );

  await kv.set(LEADERBOARD_STORAGE_KEY, updated);
  return updated;
}
