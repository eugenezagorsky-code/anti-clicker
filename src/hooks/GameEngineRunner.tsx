"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { AUTONOMOUS_MELTDOWN_MS, AUTONOMOUS_TICK_MS, IDLE_DISCONNECT_MS } from "@/lib/constants";

/** Runs once inside GameProvider — owns autonomous ticks, meltdown, and idle disconnect timers. */
export function GameEngineRunner() {
  const { state, dispatch } = useGame();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meltdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meltdownScheduledRef = useRef(false);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutonomousInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearMeltdownTimeout = useCallback(() => {
    if (meltdownTimeoutRef.current !== null) {
      clearTimeout(meltdownTimeoutRef.current);
      meltdownTimeoutRef.current = null;
    }
    meltdownScheduledRef.current = false;
  }, []);

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state.phase !== "autonomous" || state.isFrozen) {
      clearAutonomousInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      dispatch({ type: "AUTONOMOUS_TICK" });
    }, AUTONOMOUS_TICK_MS);

    return clearAutonomousInterval;
  }, [state.phase, state.isFrozen, dispatch, clearAutonomousInterval]);

  useEffect(() => {
    if (state.phase !== "autonomous") {
      clearMeltdownTimeout();
      return;
    }

    if (meltdownScheduledRef.current) {
      return;
    }
    meltdownScheduledRef.current = true;

    const elapsed = state.autonomousStartedAt
      ? Date.now() - state.autonomousStartedAt
      : 0;
    const remaining = Math.max(0, AUTONOMOUS_MELTDOWN_MS - elapsed);

    meltdownTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "TRIGGER_MELTDOWN" });
    }, remaining);

    return clearMeltdownTimeout;
  }, [
    state.phase,
    state.autonomousStartedAt,
    dispatch,
    clearMeltdownTimeout,
  ]);

  useEffect(() => {
    if (
      state.phase !== "active" ||
      state.lastManualActivityAt === null ||
      state.idleDisconnectPaused
    ) {
      clearIdleTimeout();
      return;
    }

    const elapsed = Date.now() - state.lastManualActivityAt;
    const remaining = Math.max(0, IDLE_DISCONNECT_MS - elapsed);

    idleTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "TRIGGER_IDLE_DISCONNECT" });
    }, remaining);

    return clearIdleTimeout;
  }, [
    state.phase,
    state.lastManualActivityAt,
    state.idleDisconnectPaused,
    dispatch,
    clearIdleTimeout,
  ]);

  return null;
}
