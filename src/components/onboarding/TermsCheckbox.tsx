import { onboardingCopy } from "@/content/onboarding";

export function TermsCheckbox() {
  return (
    <label className="flex cursor-default select-none items-start gap-3 text-xs text-text-muted">
      <span
        aria-hidden
        className="mt-0.5 shrink-0 font-mono text-accent"
      >
        [X]
      </span>
      <input
        type="checkbox"
        checked
        readOnly
        disabled
        aria-disabled="true"
        className="sr-only"
      />
      <span>{onboardingCopy.terms.label}</span>
    </label>
  );
}
