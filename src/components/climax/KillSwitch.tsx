"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Power } from "lucide-react";
import { climaxCopy } from "@/content/climax";
import { useGameEngine } from "@/hooks/useGameEngine";

const PROXIMITY_PX = 140;
const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 52;

function randomPosition(): { top: number; left: number } {
  const maxTop = Math.max(0, window.innerHeight - BUTTON_HEIGHT - 16);
  const maxLeft = Math.max(0, window.innerWidth - BUTTON_WIDTH - 16);
  return {
    top: 16 + Math.random() * maxTop,
    left: 16 + Math.random() * maxLeft,
  };
}

export function KillSwitch() {
  const { handleKillSwitch } = useGameEngine();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 120, left: 120 });
  const evadingRef = useRef(false);

  const evade = useCallback(() => {
    if (evadingRef.current) return;
    evadingRef.current = true;
    setPosition(randomPosition());
    window.setTimeout(() => {
      evadingRef.current = false;
    }, 80);
  }, []);

  useEffect(() => {
    setPosition(randomPosition());

    const handleMouseMove = (event: MouseEvent) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

      if (distance < PROXIMITY_PX) {
        evade();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [evade]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleKillSwitch}
      onMouseEnter={evade}
      style={{ top: position.top, left: position.left }}
      className="kill-switch fixed z-[60] flex items-center gap-2 border-2 border-danger-bright bg-surface-raised px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider text-danger-bright transition-none"
      aria-label={climaxCopy.killSwitch.ariaLabel}
    >
      <Power className="h-4 w-4" />
      {climaxCopy.killSwitch.label}
    </button>
  );
}
