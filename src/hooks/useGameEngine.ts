"use client";

import { useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export function useGameEngine() {
  const { state, dispatch } = useGame();
  const { play } = useSoundEffects();

  const handleGenerateClick = useCallback(() => {
    if (state.phase !== "active") return;
    dispatch({ type: "MANUAL_CLICK" });
  }, [state.phase, dispatch]);

  const handleAcceptCarbonDebt = useCallback(() => {
    if (state.phase !== "paywall") return;
    play("purchase");
    dispatch({ type: "ACCEPT_CARBON_DEBT" });
  }, [state.phase, dispatch, play]);

  const handleKillSwitch = useCallback(() => {
    if (state.phase !== "autonomous") return;
    play("killSwitch");
    dispatch({ type: "TRIGGER_KILL_SWITCH" });
  }, [state.phase, dispatch, play]);

  const handleManualDisconnect = useCallback(() => {
    if (state.phase !== "active") return;
    play("disconnect");
    dispatch({ type: "TRIGGER_IDLE_DISCONNECT" });
  }, [state.phase, dispatch, play]);

  return {
    handleGenerateClick,
    handleAcceptCarbonDebt,
    handleKillSwitch,
    handleManualDisconnect,
    canManualClick: state.phase === "active",
    isAutonomous: state.phase === "autonomous",
    showPaywall: state.phase === "paywall",
    showRogueAndroid: state.phase === "autonomous",
    showKillSwitch: state.phase === "autonomous",
    isMeltdown: state.phase === "meltdown",
    isDisconnected: state.phase === "disconnected",
    isGameOver: state.phase === "gameOver",
  };
}
