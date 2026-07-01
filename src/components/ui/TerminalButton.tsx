"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface TerminalButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  size?: "default" | "large";
  variant?: "primary" | "danger" | "neutral" | "success" | "warning";
}

const variantClasses = {
  primary:
    "border-accent text-accent hover:bg-accent/10 hover:shadow-crt disabled:border-accent/30 disabled:text-accent/30",
  danger:
    "border-danger-bright text-danger-bright hover:bg-danger-bright/10 disabled:border-danger-bright/30 disabled:text-danger-bright/30",
  success:
    "border-success-bright text-success-bright hover:bg-success/10 disabled:border-success/30 disabled:text-success/30",
  warning:
    "border-warning-bright text-warning-bright hover:bg-warning/10 disabled:border-warning/30 disabled:text-warning/30",
  neutral:
    "border-border text-text hover:border-accent hover:text-accent disabled:border-border/50 disabled:text-text-muted",
};

const sizeClasses = {
  default: "px-6 py-3 text-sm",
  large: "px-16 py-8 text-xl",
};

export function TerminalButton({
  children,
  size = "default",
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: TerminalButtonProps) {
  return (
    <motion.button
      type={type}
      className={`border bg-surface-raised font-medium uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
