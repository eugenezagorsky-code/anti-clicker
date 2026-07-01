import { motionTokens } from "@/theme/tokens";

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: motionTokens.corporateDuration,
    ease: "easeInOut",
  },
};

export const fadeInSlow = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

export const modalSpring = {
  initial: { scale: 0.92, y: 24 },
  animate: { scale: 1, y: 0 },
  transition: motionTokens.modalSpring,
};

export const modalFadeScale = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35 },
};

export const slideInRight = {
  initial: { x: 320, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: motionTokens.slideSpring,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motionTokens.corporateDuration },
};

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const screenShake = {
  animate: { x: [0, -4, 4, -2, 2, 0] },
  transition: {
    duration: motionTokens.chaoticDuration,
    repeat: Infinity,
  },
};

export const spinInfinite = {
  animate: { rotate: 360 },
  transition: { duration: 4, repeat: Infinity, ease: "linear" },
};

export const pulseOpacity = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 1.2, repeat: Infinity },
};

export const buttonHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const doNotPressHover = {
  whileHover: {
    scale: 0.97,
    opacity: 0.82,
    x: [0, -1, 1, -0.5, 0.5, 0],
    y: [0, 0.5, -0.5, 0],
  },
  whileTap: { scale: 0.94 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

export type IntensityTier = "mild" | "medium" | "intense";

export function getIntensityTier(clickNumber: number): IntensityTier {
  if (clickNumber <= 2) return "mild";
  if (clickNumber <= 5) return "medium";
  return "intense";
}

export function generationPulse(intensity: IntensityTier) {
  const scale = intensity === "mild" ? 1.01 : intensity === "medium" ? 1.02 : 1.04;
  const glow =
    intensity === "mild"
      ? "0 0 20px rgba(0, 212, 232, 0.25)"
      : intensity === "medium"
        ? "0 0 35px rgba(0, 212, 232, 0.45)"
        : "0 0 50px rgba(0, 212, 232, 0.65)";

  return {
    animate: {
      scale: [1, scale, 1],
      boxShadow: [
        "0 0 0px rgba(0, 212, 232, 0)",
        glow,
        "0 0 0px rgba(0, 212, 232, 0)",
      ],
    },
    transition: {
      duration: intensity === "intense" ? 0.6 : 0.9,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
}

export function consequenceReveal(intensity: IntensityTier) {
  const y = intensity === "mild" ? 8 : intensity === "medium" ? 14 : 20;
  const shake =
    intensity === "intense"
      ? { x: [0, -3, 3, -2, 2, 0] as number[] }
      : intensity === "medium"
        ? { x: [0, -1, 1, 0] as number[] }
        : {};

  return {
    initial: { opacity: 0, y, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1, x: 0, ...shake },
    exit: { opacity: 0, y: -8, scale: 0.98 },
    transition: {
      duration: intensity === "intense" ? 0.35 : 0.45,
      ease: "easeOut",
    },
  };
}

export function chipStagger(index: number) {
  return {
    initial: { opacity: 0, scale: 0.8, y: 6 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { delay: 0.08 + index * 0.06, duration: 0.3 },
  };
}
