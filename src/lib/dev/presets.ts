import type { GameState } from "@/types/game";
import { INITIAL_GAME_STATE } from "@/types/game";

export type DevPhase =
  | "onboarding"
  | "dashboard"
  | "paywall"
  | "autonomous"
  | "meltdown"
  | "disconnected"
  | "gameOver";

export const DEV_PHASE_OPTIONS: { value: DevPhase; label: string }[] = [
  { value: "onboarding", label: "Onboarding" },
  { value: "dashboard", label: "Dashboard" },
  { value: "paywall", label: "Paywall" },
  { value: "autonomous", label: "Autonomous" },
  { value: "meltdown", label: "Meltdown" },
  { value: "disconnected", label: "Disconnected" },
  { value: "gameOver", label: "Game Over" },
];

const SAMPLE_METRICS = {
  waterMl: 2500,
  carbonKg: 18,
  gridStress: 45,
  displacement: 3,
};

const SAMPLE_TICKER = [
  "Click 1: AI drafts listing copy for a 'vintage Nike hoodie, 9/10 condition'. 500ml of water evaporates to cool server racks. Irony Alert: Second-hand carbon savings neutralized by prompt inference.",
  "Click 2: User applies AI Background Eraser to 50 fast-fashion items. A coal power plant throttles up to meet demand. Air quality index drops near the primary server node.",
  "Click 3: Anti-Fraud AI deep-scans a suspected counterfeit bag using a heavy vision model. Regional grid stress spikes; 12 nearby households experience micro-blackouts.",
  "Click 4: AI updates 'Items You May Like' feed for 4 million buyers at once. Data center expansion displaces a local neighborhood to clear space for a water-cooling tower block.",
];

export function getDevStateForPhase(
  phase: DevPhase,
  operatorName = "Dev Operator",
): GameState {
  const base: GameState = {
    ...INITIAL_GAME_STATE,
    operatorName,
    metrics: SAMPLE_METRICS,
    tickerEvents: SAMPLE_TICKER,
    lastManualActivityAt: Date.now(),
  };

  switch (phase) {
    case "onboarding":
      return { ...INITIAL_GAME_STATE, phase: "onboarding" };
    case "dashboard":
      return {
        ...base,
        phase: "active",
        clicks: 3,
        carbonDebtAccepted: false,
      };
    case "paywall":
      return {
        ...base,
        phase: "paywall",
        clicks: 4,
      };
    case "autonomous":
      return {
        ...base,
        phase: "autonomous",
        clicks: 7,
        isAutonomous: true,
        carbonDebtAccepted: true,
        autonomousStartedAt: Date.now(),
      };
    case "meltdown":
      return {
        ...base,
        phase: "meltdown",
        clicks: 42,
        isAutonomous: true,
        isFrozen: true,
        carbonDebtAccepted: true,
        autonomousStartedAt: Date.now() - 14_000,
      };
    case "disconnected":
      return {
        ...base,
        phase: "disconnected",
        clicks: 2,
        isFrozen: true,
      };
    case "gameOver":
      return {
        ...base,
        phase: "gameOver",
        clicks: 52,
        isFrozen: true,
        isAutonomous: true,
        carbonDebtAccepted: true,
        endReason: "manual_shutdown",
        leaderboard: [
          {
            operatorName: "Prior Offender",
            ecologicalDamageScore: 4200,
            totalClicks: 38,
            completedAt: new Date(Date.now() - 86_400_000).toISOString(),
            metrics: SAMPLE_METRICS,
          },
        ],
      };
  }
}

export function parseDevPhase(
  value: string | null,
): DevPhase | null {
  if (!value) return null;
  return DEV_PHASE_OPTIONS.some((o) => o.value === value)
    ? (value as DevPhase)
    : null;
}
