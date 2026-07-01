import { IDLE_DISCONNECT_MS } from "@/lib/constants";

export function getIdleSecondsLeft(lastManualActivityAt: number | null): number {
  if (lastManualActivityAt === null) {
    return Math.ceil(IDLE_DISCONNECT_MS / 1000);
  }
  const elapsed = Date.now() - lastManualActivityAt;
  return Math.max(0, Math.ceil((IDLE_DISCONNECT_MS - elapsed) / 1000));
}

export function getIdleSecondsDisplay(
  lastManualActivityAt: number | null,
  paused: boolean,
  frozenSeconds: number | null,
): number {
  if (paused && frozenSeconds !== null) {
    return frozenSeconds;
  }
  return getIdleSecondsLeft(lastManualActivityAt);
}
