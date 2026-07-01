"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { TerminalButton } from "@/components/ui/TerminalButton";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { onboardingCopy } from "@/content/onboarding";
import { useGame } from "@/context/GameContext";
import { TermsCheckbox } from "@/components/onboarding/TermsCheckbox";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { fadeIn } from "@/lib/motion";

export function WelcomeScreen() {
  const { initializeGame } = useGame();
  const { play } = useSoundEffects();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(onboardingCopy.errors.nameRequired);
      return;
    }
    setError("");
    play("initialize");
    initializeGame(trimmed);
  }

  return (
    <motion.div
      {...fadeIn}
      initial={false}
      className="flex min-h-screen flex-col items-center justify-center bg-surface px-6"
    >
      <TerminalPanel className="w-full max-w-md">
        <div className="space-y-8 p-8">
          <header className="text-center">
            <h1 className="text-xl font-medium tracking-tight text-text crt-glow-text">
              {onboardingCopy.title}
            </h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="operator-name"
                className="block text-xs font-medium uppercase tracking-wider text-text-muted"
              >
                {onboardingCopy.nameLabel}
              </label>
              <input
                id="operator-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="w-full border border-border bg-surface px-3 py-3 text-text placeholder-text-muted outline-none transition-colors focus:border-accent"
                placeholder={onboardingCopy.namePlaceholder}
              />
              {error && (
                <p className="text-xs text-danger-bright" role="alert">
                  {error}
                </p>
              )}
            </div>

            <TermsCheckbox />

            <TerminalButton type="submit" className="w-full" variant="neutral">
              {onboardingCopy.submitCta}
            </TerminalButton>
          </form>
        </div>
      </TerminalPanel>
    </motion.div>
  );
}
