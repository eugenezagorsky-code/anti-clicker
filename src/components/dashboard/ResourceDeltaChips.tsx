"use client";

import { motion } from "framer-motion";
import { chipStagger } from "@/lib/motion";
import type { MetricDeltaChip } from "@/lib/formatMetricDelta";

interface ResourceDeltaChipsProps {
  chips: MetricDeltaChip[];
  intensityClickNumber: number;
}

export function ResourceDeltaChips({
  chips,
}: ResourceDeltaChipsProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {chips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <motion.div
            key={chip.key}
            {...chipStagger(index)}
            className="flex items-center gap-1.5 border border-accent/30 px-2 py-1 font-mono text-[10px] text-accent"
          >
            <Icon className="h-3 w-3 shrink-0" />
            <span className="uppercase tracking-wider opacity-70">
              {chip.label.split(" ")[0]}
            </span>
            <span className="tabular-nums">{chip.formattedDelta}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
