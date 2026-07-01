"use client";

import { Droplets, Factory, Home, Zap } from "lucide-react";
import { dashboardCopy } from "@/content/dashboard";
import type { Metrics } from "@/types/game";

interface MetricsStripProps {
  metrics: Metrics;
}

const STRIP_ITEMS = {
  water: {
    icon: Droplets,
    label: "H₂O",
    title: dashboardCopy.metrics.water,
    format: (m: Metrics) => `${(m.waterMl / 1000).toFixed(1)}L`,
  },
  carbon: {
    icon: Factory,
    label: "CO₂",
    title: dashboardCopy.metrics.carbon,
    format: (m: Metrics) => `${m.carbonKg.toFixed(1)}kg`,
  },
  grid: {
    icon: Zap,
    label: "Grid",
    title: dashboardCopy.metrics.grid,
    format: (m: Metrics) => `${m.gridStress.toFixed(0)}%`,
  },
  displacement: {
    icon: Home,
    label: "Disp.",
    title: dashboardCopy.metrics.displacement,
    format: (m: Metrics) => m.displacement.toString(),
  },
} as const;

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-border p-4">
      <span className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
        Telemetry
      </span>
      {(Object.keys(STRIP_ITEMS) as Array<keyof typeof STRIP_ITEMS>).map(
        (key) => {
          const { icon: Icon, label, title, format } = STRIP_ITEMS[key];
          return (
            <div
              key={key}
              className="flex items-center gap-1.5"
              title={title}
            >
              <Icon className="h-3 w-3 text-accent/70" />
              <span className="text-[9px] uppercase tracking-wider text-text-muted">
                {label}
              </span>
              <span className="font-mono text-xs tabular-nums text-text-muted">
                {format(metrics)}
              </span>
              {key === "grid" && (
                <div className="ml-1 flex gap-px">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-1 ${
                        metrics.gridStress / 25 > i
                          ? metrics.gridStress >= 60
                            ? "bg-danger"
                            : "bg-accent/60"
                          : "bg-surface"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        },
      )}
    </div>
  );
}
