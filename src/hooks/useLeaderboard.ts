"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/GameContext";
import {
  fetchLeaderboard,
  submitLeaderboardEntry,
} from "@/lib/leaderboardApi";
import { calculateEcologicalDamageScore } from "@/lib/scoreCalculator";
import type { LeaderboardEntry } from "@/types/game";

export function useLeaderboard() {
  const { state, dispatch } = useGame();
  const [currentEntryCompletedAt, setCurrentEntryCompletedAt] = useState<
    string | null
  >(null);
  const hasLoadedRef = useRef(false);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }
    hasLoadedRef.current = true;

    let cancelled = false;

    async function load() {
      const entries = await fetchLeaderboard();
      if (!cancelled) {
        dispatch({ type: "LOAD_LEADERBOARD", entries });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (state.phase !== "gameOver") {
      if (state.phase === "onboarding") {
        hasSavedRef.current = false;
        setCurrentEntryCompletedAt(null);
      }
      return;
    }

    if (hasSavedRef.current) {
      return;
    }
    hasSavedRef.current = true;

    const completedAt = new Date().toISOString();
    const entry: LeaderboardEntry = {
      operatorName: state.operatorName,
      ecologicalDamageScore: calculateEcologicalDamageScore(
        state.metrics,
        state.clicks,
      ),
      totalClicks: state.clicks,
      completedAt,
      metrics: { ...state.metrics },
    };

    let cancelled = false;

    async function save() {
      const updated = await submitLeaderboardEntry(entry);
      if (cancelled) {
        return;
      }
      dispatch({ type: "LOAD_LEADERBOARD", entries: updated });
      setCurrentEntryCompletedAt(completedAt);
    }

    void save();

    return () => {
      cancelled = true;
    };
  }, [
    state.phase,
    state.operatorName,
    state.metrics,
    state.clicks,
    dispatch,
  ]);

  return { currentEntryCompletedAt };
}
