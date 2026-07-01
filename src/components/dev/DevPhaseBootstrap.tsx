"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { getDevStateForPhase, parseDevPhase } from "@/lib/dev/presets";

export function DevPhaseBootstrap() {
  const searchParams = useSearchParams();
  const { dispatch } = useGame();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const devPhase = parseDevPhase(searchParams.get("devPhase"));
    if (!devPhase || appliedRef.current) {
      return;
    }

    appliedRef.current = true;
    const operatorName =
      searchParams.get("operatorName")?.trim() || "Dev Operator";
    const state = getDevStateForPhase(devPhase, operatorName);

    dispatch({ type: "DEV_OVERRIDE", state });
  }, [searchParams, dispatch]);

  return null;
}
