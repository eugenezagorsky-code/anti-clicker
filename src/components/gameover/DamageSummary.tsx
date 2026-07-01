"use client";

import { motion } from "framer-motion";
import { Droplets, Factory, Home, Zap } from "lucide-react";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { gameoverCopy } from "@/content/gameover";
import { damageTierStyles, getDamageTier } from "@/lib/damageTier";
import {
  formatDamageScore,
  formatDamageScoreFull,
} from "@/lib/scoreCalculator";
import {
  formatMetricValue,
  METRIC_LABELS,
  type MetricKey,
} from "@/lib/formatMetrics";
import { fadeInUp } from "@/lib/motion";
import type { Metrics } from "@/types/game";

interface DamageSummaryProps {
  operatorName: string;
  metrics: Metrics;
  clicks: number;
  ecologicalDamageScore: number;
}

const CARD_ICONS: Record<MetricKey, typeof Droplets> = {
  water: Droplets,
  carbon: Factory,
  grid: Zap,
  displacement: Home,
};

const METRIC_KEYS: MetricKey[] = ["water", "carbon", "grid", "displacement"];
const copy = gameoverCopy.damageSummary;

function getEyebrow(tier: ReturnType<typeof getDamageTier>): string {
  switch (tier) {
    case "pristine":
      return copy.eyebrowPristine;
    case "partial":
      return copy.eyebrowPartial;
    case "severe":
      return copy.eyebrow;
  }
}

function getSessionLine(tier: ReturnType<typeof getDamageTier>): string {
  switch (tier) {
    case "pristine":
      return copy.sessionComplete;
    case "partial":
      return copy.sessionPartial;
    case "severe":
      return copy.sessionTerminated;
  }
}

export function DamageSummary({
  operatorName,
  metrics,
  clicks,
  ecologicalDamageScore,
}: DamageSummaryProps) {
  const tier = getDamageTier(metrics, clicks);
  const styles = damageTierStyles[tier];

  return (
    <motion.div
      {...fadeInUp}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
    >
      <TerminalPanel className={`p-6 text-center ${styles.panel}`}>
        <p
          className={`text-xs font-semibold uppercase tracking-corporate ${styles.eyebrow}`}
        >
          {getEyebrow(tier)}
        </p>
        <h3 className="mt-3 text-lg font-medium text-text-muted">
          {copy.operatorPrefix}{" "}
          <span className="text-text">{operatorName}</span>
          <span className="text-muted"> — </span>
          <span className={styles.headline}>{getSessionLine(tier)}</span>
        </h3>
        <p
          className={`mt-4 text-4xl font-medium tabular-nums ${styles.score}`}
          title={formatDamageScoreFull(ecologicalDamageScore)}
        >
          {formatDamageScore(ecologicalDamageScore)}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-text-muted">
          {copy.scoreLabel}
        </p>
        {tier === "pristine" && (
          <p className={`mt-3 text-sm ${styles.subtext}`}>{copy.scoreZeroMessage}</p>
        )}
        {tier === "partial" && (
          <p className={`mt-3 text-sm ${styles.subtext}`}>
            {copy.scorePartialMessage}
          </p>
        )}
      </TerminalPanel>

      <div className={`grid grid-cols-2 border md:grid-cols-4 ${styles.grid}`}>
        {METRIC_KEYS.map((key, index) => {
          const Icon = CARD_ICONS[key];
          return (
            <div
              key={key}
              className={`crt-panel border-0 p-4 ${styles.gridCell} ${
                index % 2 === 0 ? "border-r" : ""
              } ${index < 2 ? "border-b md:border-b-0" : ""} ${
                index < 3 ? "md:border-r" : ""
              }`}
            >
              <Icon className={`mb-2 h-4 w-4 ${styles.icon}`} />
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                {METRIC_LABELS[key]}
              </p>
              <p className={`mt-1 text-xl font-medium tabular-nums ${styles.metric}`}>
                {formatMetricValue(key, metrics)}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
