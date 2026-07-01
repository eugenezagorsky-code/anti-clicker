export const MAX_TICKER_EVENTS = 50;
export const PAYWALL_CLICK = 5;
export const AUTONOMY_CLICK = 7;
export const AUTONOMOUS_TICK_MS = 100;
export const AUTONOMOUS_MELTDOWN_MS = 15_000;
export const IDLE_DISCONNECT_MS = 30_000;
export const LEADERBOARD_STORAGE_KEY = "nexus_shame_registry";
export const LEADERBOARD_MAX_ENTRIES = 100;

export const GENERATION_BASE_MS = 2000;
export const GENERATION_PER_CLICK_MS = 250;
export const GENERATION_MAX_MS = 4500;
export const REVEAL_COOLDOWN_MS = 400;
export const REVEAL_DISPLAY_MS = 1800;

export function getGenerationDelayMs(currentClicks: number): number {
  return Math.min(
    GENERATION_BASE_MS + currentClicks * GENERATION_PER_CLICK_MS,
    GENERATION_MAX_MS,
  );
}
