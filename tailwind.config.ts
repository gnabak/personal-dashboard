import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-subtle) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-border) / <alpha-value>)",
        ring: "rgb(var(--color-primary) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-background) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--color-danger) / <alpha-value>)",
          foreground: "rgb(var(--color-background) / <alpha-value>)",
        },
        // Semantic accents — exact values come from active theme
        warm: "rgb(var(--color-warm) / <alpha-value>)",
        cool: "rgb(var(--color-cool) / <alpha-value>)",
        emphasis: "rgb(var(--color-emphasis) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
        // Backwards-compatible legacy names mapped to semantic slots
        green: "rgb(var(--color-primary) / <alpha-value>)",
        orange: "rgb(var(--color-warm) / <alpha-value>)",
        sky: "rgb(var(--color-cool) / <alpha-value>)",
        gold: "rgb(var(--color-emphasis) / <alpha-value>)",
        red: "rgb(var(--color-danger) / <alpha-value>)",
        comment: "rgb(var(--color-subtle) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius-card, 0.5rem)",
        md: "calc(var(--radius-card, 0.5rem) * 0.75)",
        sm: "calc(var(--radius-card, 0.5rem) * 0.5)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        display: ["var(--font-display)", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
