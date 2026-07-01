export type GamePhase =
  | "onboarding"
  | "active"
  | "paywall"
  | "autonomous"
  | "meltdown"
  | "disconnected"
  | "gameOver";

/** Session-facing alias: ONBOARDING maps to `onboarding`, PLAYING maps to `active`. */
export type GameStateLabel = "ONBOARDING" | "PLAYING";

export type GameEndReason = "idle" | "meltdown" | "manual_shutdown";

export interface Metrics {
  waterMl: number;
  carbonKg: number;
  gridStress: number;
  displacement: number;
}

export interface LeaderboardEntry {
  operatorName: string;
  ecologicalDamageScore: number;
  totalClicks: number;
  completedAt: string;
  metrics: Metrics;
}

export interface GameState {
  phase: GamePhase;
  operatorName: string;
  clicks: number;
  metrics: Metrics;
  carbonDebtAccepted: boolean;
  isAutonomous: boolean;
  isFrozen: boolean;
  autonomousStartedAt: number | null;
  lastManualActivityAt: number | null;
  idleDisconnectPaused: boolean;
  idleDisconnectFrozenSeconds: number | null;
  endReason: GameEndReason | null;
  leaderboard: LeaderboardEntry[];
  tickerEvents: string[];
}

export const INITIAL_METRICS: Metrics = {
  waterMl: 0,
  carbonKg: 0,
  gridStress: 0,
  displacement: 0,
};

export const INITIAL_GAME_STATE: GameState = {
  phase: "onboarding",
  operatorName: "",
  clicks: 0,
  metrics: INITIAL_METRICS,
  carbonDebtAccepted: false,
  isAutonomous: false,
  isFrozen: false,
  autonomousStartedAt: null,
  lastManualActivityAt: null,
  idleDisconnectPaused: false,
  idleDisconnectFrozenSeconds: null,
  endReason: null,
  leaderboard: [],
  tickerEvents: [],
};

export type GameAction =
  | { type: "SUBMIT_NAME"; name: string }
  | { type: "MANUAL_CLICK" }
  | { type: "GENERATION_STARTED" }
  | { type: "GENERATION_COMPLETED" }
  | { type: "ACCEPT_CARBON_DEBT" }
  | { type: "AUTONOMOUS_TICK" }
  | { type: "TRIGGER_MELTDOWN" }
  | { type: "TRIGGER_IDLE_DISCONNECT" }
  | { type: "TRIGGER_KILL_SWITCH" }
  | { type: "LOAD_LEADERBOARD"; entries: LeaderboardEntry[] }
  | { type: "RESET_GAME" }
  | { type: "DEV_OVERRIDE"; state: GameState };

export interface ClickConsequence {
  metricsDelta: Partial<Metrics>;
  tickerMessage: string;
}

export function phaseToGameStateLabel(phase: GamePhase): GameStateLabel {
  return phase === "onboarding" ? "ONBOARDING" : "PLAYING";
}
