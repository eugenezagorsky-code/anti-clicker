"use client";

import { motion } from "framer-motion";
import { dashboardCopy } from "@/content/dashboard";
import { ResourceDeltaChips } from "@/components/dashboard/ResourceDeltaChips";
import { formatMetricDeltas } from "@/lib/formatMetricDelta";
import { fadeInUp } from "@/lib/motion";
import type { PendingConsequence } from "@/hooks/useGenerationCycle";

interface PinnedConsequenceProps {
  pending: PendingConsequence;
}

export function PinnedConsequence({ pending }: PinnedConsequenceProps) {
  const chips = formatMetricDeltas(pending.consequence.metricsDelta);

  return (
    <motion.div
      {...fadeInUp}
      className="border border-danger-bright/30 bg-surface-raised/80 px-5 py-4 text-center"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-danger-bright">
        {dashboardCopy.consequence.deployedLabel}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text">
        {pending.message}
      </p>
      {chips.length > 0 && (
        <div className="mt-4">
          <ResourceDeltaChips
            chips={chips}
            intensityClickNumber={pending.clickNumber}
          />
        </div>
      )}
    </motion.div>
  );
}
