import { Droplets, Factory, Home, Zap, type LucideIcon } from "lucide-react";
import { dashboardCopy } from "@/content/dashboard";
import type { Metrics } from "@/types/game";

export type MetricDeltaKey = "water" | "carbon" | "grid" | "displacement";

export interface MetricDeltaChip {
  key: MetricDeltaKey;
  icon: LucideIcon;
  label: string;
  formattedDelta: string;
}

const ICONS: Record<MetricDeltaKey, LucideIcon> = {
  water: Droplets,
  carbon: Factory,
  grid: Zap,
  displacement: Home,
};

const LABELS: Record<MetricDeltaKey, string> = {
  water: dashboardCopy.metrics.water,
  carbon: dashboardCopy.metrics.carbon,
  grid: dashboardCopy.metrics.grid,
  displacement: dashboardCopy.metrics.displacement,
};

function formatDelta(key: MetricDeltaKey, value: number): string {
  switch (key) {
    case "water":
      return value >= 1000
        ? `+${(value / 1000).toFixed(1)} L`
        : `+${value} ml`;
    case "carbon":
      return `+${value.toFixed(1)} kg`;
    case "grid":
      return `+${value.toFixed(0)}%`;
    case "displacement":
      return `+${value}`;
  }
}

export function formatMetricDeltas(
  delta: Partial<Metrics>,
): MetricDeltaChip[] {
  const chips: MetricDeltaChip[] = [];

  if (delta.waterMl && delta.waterMl > 0) {
    chips.push({
      key: "water",
      icon: ICONS.water,
      label: LABELS.water,
      formattedDelta: formatDelta("water", delta.waterMl),
    });
  }
  if (delta.carbonKg && delta.carbonKg > 0) {
    chips.push({
      key: "carbon",
      icon: ICONS.carbon,
      label: LABELS.carbon,
      formattedDelta: formatDelta("carbon", delta.carbonKg),
    });
  }
  if (delta.gridStress && delta.gridStress > 0) {
    chips.push({
      key: "grid",
      icon: ICONS.grid,
      label: LABELS.grid,
      formattedDelta: formatDelta("grid", delta.gridStress),
    });
  }
  if (delta.displacement && delta.displacement > 0) {
    chips.push({
      key: "displacement",
      icon: ICONS.displacement,
      label: LABELS.displacement,
      formattedDelta: formatDelta("displacement", delta.displacement),
    });
  }

  return chips;
}
