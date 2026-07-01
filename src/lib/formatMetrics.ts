import { dashboardCopy } from "@/content/dashboard";
import type { Metrics } from "@/types/game";

export type MetricKey = "water" | "carbon" | "grid" | "displacement";

export const METRIC_LABELS: Record<MetricKey, string> = {
  water: dashboardCopy.metrics.water,
  carbon: dashboardCopy.metrics.carbon,
  grid: dashboardCopy.metrics.grid,
  displacement: dashboardCopy.metrics.displacement,
};

export function formatMetricValue(key: MetricKey, metrics: Metrics): string {
  switch (key) {
    case "water":
      return `${(metrics.waterMl / 1000).toFixed(1)} L`;
    case "carbon":
      return `${metrics.carbonKg.toFixed(1)} kg`;
    case "grid":
      return `${metrics.gridStress.toFixed(0)}%`;
    case "displacement":
      return metrics.displacement.toString();
  }
}
