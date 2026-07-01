"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { PinnedConsequence } from "@/components/dashboard/PinnedConsequence";
import { dashboardCopy } from "@/content/dashboard";
import type {
  LogDisplayMode,
  PendingConsequence,
} from "@/hooks/useGenerationCycle";

interface ActivityLogProps {
  events: string[];
  pending: PendingConsequence | null;
  logDisplay: LogDisplayMode;
  onLogDisplayChange: (mode: LogDisplayMode) => void;
}

export function ActivityLog({
  events,
  pending,
  logDisplay,
  onLogDisplayChange,
}: ActivityLogProps) {
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastEvent = events[events.length - 1];

  useEffect(() => {
    const el = scrollRef.current;
    if (el && historyExpanded) {
      el.scrollTop = el.scrollHeight;
    }
  }, [events, historyExpanded]);

  useEffect(() => {
    if (logDisplay === "pinned") {
      setHistoryExpanded(false);
    }
  }, [logDisplay, pending?.clickNumber]);

  const showPinned = logDisplay === "pinned" && pending !== null && !historyExpanded;

  if (showPinned) {
    return (
      <div className="p-4">
        <TerminalPanel title={dashboardCopy.activityLog.title} className="w-full">
          <div className="p-4">
            <PinnedConsequence pending={pending} />
          </div>
          <div className="flex justify-end border-t border-border px-3 py-2">
            <button
              type="button"
              onClick={() => setHistoryExpanded(true)}
              className="text-[10px] uppercase tracking-wider text-text-muted hover:text-accent"
            >
              {dashboardCopy.activityLog.toggle}
            </button>
          </div>
        </TerminalPanel>
      </div>
    );
  }

  if (historyExpanded) {
    return (
      <div className="p-4">
        <TerminalPanel title={dashboardCopy.activityLog.title} className="w-full">
          <div className="flex justify-end border-b border-border px-3 py-1">
            <button
              type="button"
              onClick={() => {
                setHistoryExpanded(false);
                if (pending) {
                  onLogDisplayChange("pinned");
                } else {
                  onLogDisplayChange("minimized");
                }
              }}
              className="text-[10px] uppercase tracking-wider text-text-muted hover:text-accent"
            >
              {dashboardCopy.activityLog.collapse}
            </button>
          </div>
          <div
            ref={scrollRef}
            className="max-h-32 space-y-1 overflow-y-auto p-4 font-mono text-xs"
          >
            {events.length === 0 ? (
              <p className="text-text-muted">
                <span className="text-accent">&gt;</span>{" "}
                {dashboardCopy.ticker.empty}
              </p>
            ) : (
              events.map((event, index) => (
                <p key={index} className="text-accent-dim">
                  <span className="text-accent">&gt;</span> {event}
                </p>
              ))
            )}
          </div>
        </TerminalPanel>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setHistoryExpanded(true)}
        className="flex w-full items-center justify-between border border-border bg-surface-raised/50 px-3 py-2 text-left transition-colors hover:border-accent/30"
      >
        <span className="truncate font-mono text-[10px] text-text-muted">
          {events.length === 0 ? (
            dashboardCopy.ticker.empty
          ) : (
            <>
              <span className="text-accent">
                {dashboardCopy.activityLog.lastPrefix}
              </span>{" "}
              {lastEvent}
            </>
          )}
        </span>
        <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wider text-accent">
          {dashboardCopy.activityLog.toggle}
        </span>
      </button>
    </div>
  );
}
