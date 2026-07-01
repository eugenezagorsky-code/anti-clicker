import { getClickConsequence } from "@/lib/clickConsequences";
import {
  AUTONOMY_CLICK,
  MAX_TICKER_EVENTS,
  PAYWALL_CLICK,
} from "@/lib/constants";
import { getIdleSecondsLeft } from "@/lib/idleTimer";
import {
  GameAction,
  GameState,
  INITIAL_GAME_STATE,
  Metrics,
} from "@/types/game";

function applyMetricsDelta(metrics: Metrics, delta: Partial<Metrics>): Metrics {
  return {
    waterMl: metrics.waterMl + (delta.waterMl ?? 0),
    carbonKg: metrics.carbonKg + (delta.carbonKg ?? 0),
    gridStress: Math.min(100, metrics.gridStress + (delta.gridStress ?? 0)),
    displacement: metrics.displacement + (delta.displacement ?? 0),
  };
}

function applyClickConsequences(state: GameState): GameState {
  const nextClick = state.clicks + 1;
  const { metricsDelta, tickerMessage } = getClickConsequence(nextClick);

  return {
    ...state,
    clicks: nextClick,
    metrics: applyMetricsDelta(state.metrics, metricsDelta),
    tickerEvents: [...state.tickerEvents, tickerMessage].slice(
      -MAX_TICKER_EVENTS,
    ),
  };
}

function resumeIdleDisconnectTimer(state: GameState): GameState {
  return {
    ...state,
    idleDisconnectPaused: false,
    idleDisconnectFrozenSeconds: null,
    lastManualActivityAt: Date.now(),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.phase === "gameOver") {
    switch (action.type) {
      case "LOAD_LEADERBOARD":
        return { ...state, leaderboard: action.entries };
      case "RESET_GAME":
        return {
          ...INITIAL_GAME_STATE,
          leaderboard: state.leaderboard,
        };
      default:
        return state;
    }
  }

  if (state.phase === "meltdown") {
    switch (action.type) {
      case "TRIGGER_KILL_SWITCH":
        return {
          ...state,
          isFrozen: true,
          phase: "gameOver",
          endReason: "meltdown",
        };
      case "LOAD_LEADERBOARD":
        return { ...state, leaderboard: action.entries };
      default:
        return state;
    }
  }

  if (state.phase === "disconnected") {
    switch (action.type) {
      case "TRIGGER_KILL_SWITCH":
        return {
          ...state,
          isFrozen: true,
          phase: "gameOver",
          endReason: "idle",
        };
      case "LOAD_LEADERBOARD":
        return { ...state, leaderboard: action.entries };
      default:
        return state;
    }
  }

  switch (action.type) {
    case "SUBMIT_NAME": {
      const name = action.name.trim();
      if (state.phase !== "onboarding" || name.length === 0) {
        return state;
      }
      return {
        ...state,
        operatorName: name,
        phase: "active",
        lastManualActivityAt: Date.now(),
      };
    }

    case "LOAD_LEADERBOARD":
      return { ...state, leaderboard: action.entries };

    case "GENERATION_STARTED": {
      if (state.phase !== "active") {
        return state;
      }
      return {
        ...state,
        idleDisconnectPaused: true,
        idleDisconnectFrozenSeconds: getIdleSecondsLeft(state.lastManualActivityAt),
      };
    }

    case "GENERATION_COMPLETED": {
      if (state.phase !== "active") {
        return state;
      }
      return resumeIdleDisconnectTimer(state);
    }

    case "MANUAL_CLICK": {
      if (state.phase !== "active" || state.isFrozen) {
        return state;
      }

      const nextClick = state.clicks + 1;

      if (nextClick === PAYWALL_CLICK) {
        return {
          ...state,
          phase: "paywall",
        };
      }

      if (nextClick === AUTONOMY_CLICK) {
        const withConsequences = applyClickConsequences(state);
        return {
          ...withConsequences,
          phase: "autonomous",
          isAutonomous: true,
          autonomousStartedAt: Date.now(),
        };
      }

      return applyClickConsequences(state);
    }

    case "ACCEPT_CARBON_DEBT": {
      if (state.phase !== "paywall") {
        return state;
      }
      const withConsequences = applyClickConsequences(state);
      return resumeIdleDisconnectTimer({
        ...withConsequences,
        carbonDebtAccepted: true,
        phase: "active",
      });
    }

    case "AUTONOMOUS_TICK": {
      if (state.phase !== "autonomous" || state.isFrozen) {
        return state;
      }
      return applyClickConsequences(state);
    }

    case "TRIGGER_MELTDOWN": {
      if (state.phase !== "autonomous") {
        return state;
      }
      return {
        ...state,
        isFrozen: true,
        phase: "meltdown",
      };
    }

    case "TRIGGER_IDLE_DISCONNECT": {
      if (state.phase !== "active") {
        return state;
      }
      return {
        ...state,
        isFrozen: true,
        phase: "disconnected",
      };
    }

    case "TRIGGER_KILL_SWITCH": {
      if (state.phase !== "autonomous") {
        return state;
      }
      return {
        ...state,
        isFrozen: true,
        phase: "gameOver",
        endReason: "manual_shutdown",
      };
    }

    case "DEV_OVERRIDE": {
      if (process.env.NODE_ENV !== "development") {
        return state;
      }
      return action.state;
    }

    default:
      return state;
  }
}
