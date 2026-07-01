import type { ReactNode } from "react";

interface TerminalPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function TerminalPanel({
  title,
  children,
  className = "",
  headerClassName = "",
}: TerminalPanelProps) {
  return (
    <div className={`crt-panel overflow-hidden ${className}`}>
      {title && (
        <div
          className={`border-b border-border px-4 py-2 ${headerClassName}`}
        >
          <span className="text-xs font-medium uppercase tracking-corporate text-text-muted">
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
