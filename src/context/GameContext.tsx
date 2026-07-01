"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { gameReducer } from "@/context/gameReducer";
import { GameEngineRunner } from "@/hooks/GameEngineRunner";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import {
  GameAction,
  GameState,
  GameStateLabel,
  INITIAL_GAME_STATE,
  phaseToGameStateLabel,
} from "@/types/game";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  /** Session alias for `state.phase` — ONBOARDING | PLAYING */
  gameState: GameStateLabel;
  operatorName: string;
  clicks: number;
  metrics: GameState["metrics"];
  initializeGame: (name: string) => void;
  currentEntryCompletedAt: string | null;
}

const GameContext = createContext<GameContextValue | null>(null);

function LeaderboardPersistence({ children }: { children: ReactNode }) {
  const { currentEntryCompletedAt } = useLeaderboard();
  const base = useContext(GameContext);
  if (!base) {
    throw new Error("LeaderboardPersistence must be inside GameProvider");
  }

  const value = useMemo<GameContextValue>(
    () => ({ ...base, currentEntryCompletedAt }),
    [base, currentEntryCompletedAt],
  );

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  const initializeGame = useCallback((name: string) => {
    dispatch({ type: "SUBMIT_NAME", name });
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      dispatch,
      gameState: phaseToGameStateLabel(state.phase),
      operatorName: state.operatorName,
      clicks: state.clicks,
      metrics: state.metrics,
      initializeGame,
      currentEntryCompletedAt: null,
    }),
    [state, initializeGame],
  );

  return (
    <GameContext.Provider value={value}>
      <GameEngineRunner />
      <LeaderboardPersistence>{children}</LeaderboardPersistence>
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
