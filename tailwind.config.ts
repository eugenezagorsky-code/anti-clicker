import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        "accent-light": "var(--color-accent-light)",
        border: "var(--color-border)",
        danger: "var(--color-danger)",
        "danger-bright": "var(--color-danger-bright)",
        success: "var(--color-success)",
        "success-bright": "var(--color-success-bright)",
        "success-dim": "var(--color-success-dim)",
        "success-border": "var(--color-success-border)",
        warning: "var(--color-warning)",
        "warning-bright": "var(--color-warning-bright)",
        "warning-dim": "var(--color-warning-dim)",
        "warning-border": "var(--color-warning-border)",
        muted: "var(--color-muted)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
      },
      letterSpacing: {
        corporate: "0.3em",
      },
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        crt: "var(--crt-glow)",
      },
      borderRadius: {
        DEFAULT: "0",
        none: "0",
        sm: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
