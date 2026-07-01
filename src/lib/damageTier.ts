import { PAYWALL_CLICK } from "@/lib/constants";
import { hasEcologicalDamage } from "@/lib/scoreCalculator";
import type { Metrics } from "@/types/game";

export type DamageTier = "pristine" | "partial" | "severe";

/** 0 clicks = pristine; 1–4 = partial; 5+ = severe (paywall threshold and beyond). */
export function getDamageTier(metrics: Metrics, clicks: number): DamageTier {
  if (!hasEcologicalDamage(metrics, clicks)) {
    return "pristine";
  }
  if (clicks > 0 && clicks < PAYWALL_CLICK) {
    return "partial";
  }
  return "severe";
}

export const damageTierStyles = {
  pristine: {
    outerPanel: "border-success-border",
    panel: "border-success-border bg-success/5",
    grid: "border-success-border",
    gridCell: "border-success-border/50",
    eyebrow: "text-success-bright",
    headline: "text-success-bright",
    score: "text-success-bright crt-glow-text-success",
    subtext: "text-success-dim",
    icon: "text-success-bright",
    metric: "text-success-dim",
    title: "text-success-bright crt-glow-text-success",
    rowHighlight: "border-l-success-bright bg-success/10",
    rowMuted: "border-l-success/50 bg-success/5",
    name: "text-success-bright",
    marker: "text-success-dim",
    damage: "text-success-bright",
    button: "success" as const,
  },
  partial: {
    outerPanel: "border-warning-border",
    panel: "border-warning-border bg-warning/5",
    grid: "border-warning-border",
    gridCell: "border-warning-border/50",
    eyebrow: "text-warning-bright",
    headline: "text-warning-bright",
    score: "text-warning-bright crt-glow-text-warning",
    subtext: "text-warning-dim",
    icon: "text-warning-bright",
    metric: "text-warning-dim",
    title: "text-warning-bright crt-glow-text-warning",
    rowHighlight: "border-l-warning-bright bg-warning/10",
    rowMuted: "border-l-warning/50 bg-warning/5",
    name: "text-warning-bright",
    marker: "text-warning-dim",
    damage: "text-warning-bright",
    button: "warning" as const,
  },
  severe: {
    outerPanel: "",
    panel: "",
    grid: "border-border",
    gridCell: "border-border",
    eyebrow: "text-danger-bright",
    headline: "text-danger-bright",
    score: "text-danger-bright crt-glow-text",
    subtext: "text-text-muted",
    icon: "text-accent",
    metric: "text-text",
    title: "text-text crt-glow-text",
    rowHighlight: "border-l-accent bg-accent/10",
    rowMuted: "bg-surface-raised",
    name: "text-text",
    marker: "text-accent/70",
    damage: "text-danger-bright",
    button: "neutral" as const,
  },
} as const;
