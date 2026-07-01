import { AUTONOMY_CLICK } from "@/lib/constants";
import {
  TICKER_MESSAGES,
  formatTickerLine,
  getAutonomousOverdriveMessage,
  getGenericInnovationMessage,
} from "@/content/ticker";
import type { ClickConsequence } from "@/types/game";

const BASE_DELTA = {
  waterMl: 500,
  carbonKg: 0.2,
  gridStress: 3,
  displacement: 0,
};

function getAutonomousMultiplier(clickNumber: number): number {
  if (clickNumber <= AUTONOMY_CLICK) {
    return 1;
  }
  return Math.pow(2, clickNumber - AUTONOMY_CLICK);
}

export function getClickConsequence(clickNumber: number): ClickConsequence {
  const multiplier = getAutonomousMultiplier(clickNumber);

  const message =
    TICKER_MESSAGES[clickNumber] ??
    (clickNumber > AUTONOMY_CLICK
      ? getAutonomousOverdriveMessage(multiplier)
      : getGenericInnovationMessage(clickNumber));

  return {
    metricsDelta: {
      waterMl: BASE_DELTA.waterMl * multiplier,
      carbonKg: BASE_DELTA.carbonKg * multiplier,
      gridStress: BASE_DELTA.gridStress * multiplier,
      displacement:
        clickNumber >= 6
          ? Math.ceil(multiplier)
          : BASE_DELTA.displacement,
    },
    tickerMessage: formatTickerLine(clickNumber, message),
  };
}
