import { NextResponse } from "next/server";
import {
  appendLeaderboardEntry,
  getLeaderboardFromKv,
  isKvConfigured,
} from "@/lib/leaderboardServer";
import { normalizeLeaderboardEntry } from "@/lib/leaderboardValidation";

export async function GET() {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Leaderboard storage not configured" },
      { status: 503 },
    );
  }

  const entries = await getLeaderboardFromKv();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Leaderboard storage not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const entry = normalizeLeaderboardEntry(body);
  if (!entry) {
    return NextResponse.json(
      { error: "Invalid leaderboard entry" },
      { status: 400 },
    );
  }

  try {
    const entries = await appendLeaderboardEntry(entry);
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json(
      { error: "Failed to save leaderboard entry" },
      { status: 500 },
    );
  }
}
