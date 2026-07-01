interface SegmentedProgressProps {
  value: number;
  max?: number;
  segments?: number;
  label?: string;
  showPercent?: boolean;
  urgent?: boolean;
  className?: string;
}

export function SegmentedProgress({
  value,
  max = 100,
  segments = 20,
  label,
  showPercent = true,
  urgent = false,
  className = "",
}: SegmentedProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const filledCount = Math.round((percent / 100) * segments);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && (
            <span
              className={`text-[10px] font-medium uppercase tracking-wider ${
                urgent ? "text-danger" : "text-text-muted"
              }`}
            >
              {label}
            </span>
          )}
          {showPercent && (
            <span
              className={`font-mono text-xs tabular-nums ${
                urgent ? "text-danger crt-glow-text" : "text-accent"
              }`}
            >
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 ${
              i < filledCount
                ? urgent
                  ? "bg-danger"
                  : "bg-accent"
                : "bg-surface"
            }`}
            style={{
              boxShadow:
                i < filledCount && !urgent
                  ? "0 0 4px rgba(0, 212, 232, 0.4)"
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
