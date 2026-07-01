export const colors = {
  surface: "#000b1e",
  surfaceRaised: "#0a1628",
  accent: "#00d4e8",
  accentDim: "#5a8a9a",
  accentLight: "#7ec8e3",
  border: "rgba(0, 212, 232, 0.35)",
  danger: "#e8a838",
  dangerBright: "#ff4444",
  muted: "#6a8fa3",
  mutedDark: "#4a6a7a",
  text: "#d4e8f0",
  textMuted: "#6a8fa3",
} as const;

export const motionTokens = {
  corporateDuration: 0.4,
  corporateEase: [0.4, 0, 0.2, 1] as const,
  chaoticDuration: 0.12,
  modalSpring: {
    type: "spring" as const,
    stiffness: 260,
    damping: 22,
  },
  slideSpring: {
    type: "spring" as const,
    stiffness: 180,
    damping: 24,
  },
} as const;

export const spacing = {
  corporateTracking: "0.3em",
} as const;

export const decayThresholds = {
  gridStress: {
    lightGrayscale: 30,
    heavyGrayscale: 60,
  },
  carbonKg: {
    lightBlur: 15,
    heavyBlur: 25,
  },
  waterMl: {
    shake: 4000,
  },
  maxBlurPx: 2,
} as const;
