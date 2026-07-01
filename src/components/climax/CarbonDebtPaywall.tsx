"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { SignaturePad } from "@/components/ui/SignaturePad";
import { TerminalButton } from "@/components/ui/TerminalButton";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { paywallCopy } from "@/content/paywall";
import { useGameEngine } from "@/hooks/useGameEngine";
import { buttonHover, fadeInUp, modalSpring, overlayFade } from "@/lib/motion";

export function CarbonDebtPaywall() {
  const { handleAcceptCarbonDebt } = useGameEngine();
  const [hasSigned, setHasSigned] = useState(false);

  return (
    <motion.div
      {...overlayFade}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <motion.div
        {...modalSpring}
        className="relative mx-4 w-full max-w-lg"
      >
        <TerminalPanel>
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {paywallCopy.badge}
                </p>
                <h2
                  id="paywall-title"
                  className="mt-1 text-lg font-semibold text-text crt-glow-text"
                >
                  {paywallCopy.title}
                </h2>
              </div>
              <Lock className="h-4 w-4 shrink-0 text-text-muted" aria-hidden />
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="border border-accent/40 bg-surface p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-text">
                  {paywallCopy.pack.name}
                </span>
                <span className="border border-accent/50 bg-accent/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">
                  {paywallCopy.pack.badge}
                </span>
              </div>

              <p className="text-sm text-text-muted">{paywallCopy.pack.credits}</p>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-text crt-glow-text">
                {paywallCopy.pack.price}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {paywallCopy.pack.unitPrice}
              </p>

              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {paywallCopy.pack.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-text-muted"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent/70" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-text-muted">
                {paywallCopy.signature.label}
              </p>
              <SignaturePad
                placeholder={paywallCopy.signature.placeholder}
                clearLabel={paywallCopy.signature.clear}
                onSignedChange={setHasSigned}
              />
            </div>
          </div>

          <div className="border-t border-border bg-surface-raised px-6 py-5">
            <AnimatePresence mode="wait">
              {hasSigned ? (
                <motion.div key="cta" {...fadeInUp}>
                  <TerminalButton
                    onClick={handleAcceptCarbonDebt}
                    {...buttonHover}
                    className="w-full"
                  >
                    {paywallCopy.cta}
                  </TerminalButton>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  {...fadeInUp}
                  className="py-3 text-center text-[10px] uppercase tracking-widest text-text-muted"
                >
                  {paywallCopy.ctaDisabledHint}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-text-muted">
              {paywallCopy.footer}
            </p>
          </div>
        </TerminalPanel>
      </motion.div>
    </motion.div>
  );
}
