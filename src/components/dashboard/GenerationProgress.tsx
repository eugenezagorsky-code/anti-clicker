"use client";

import { SegmentedProgress } from "@/components/ui/SegmentedProgress";
import { dashboardCopy } from "@/content/dashboard";

interface GenerationProgressProps {
  progress: number;
  statusText: string | null;
}

export function GenerationProgress({
  progress,
  statusText,
}: GenerationProgressProps) {
  return (
    <div className="mt-4 w-full max-w-lg px-4">
      <SegmentedProgress
        value={progress}
        label={
          statusText
            ? `${dashboardCopy.generation.progressLabel} ${statusText}`
            : dashboardCopy.generation.progressLabel
        }
        showPercent={false}
        segments={16}
        urgent={progress > 75}
      />
    </div>
  );
}
