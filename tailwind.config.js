/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* Harbor design tokens — sourced from src/tokens.css
         so they can be themed by overriding CSS vars at runtime. */
      colors: {
        accent: "rgb(var(--harbor-accent) / <alpha-value>)",
        "accent-2": "rgb(var(--harbor-accent-2) / <alpha-value>)",
        "accent-3": "rgb(var(--harbor-accent-3) / <alpha-value>)",
        success: "rgb(var(--harbor-success) / <alpha-value>)",
        warning: "rgb(var(--harbor-warning) / <alpha-value>)",
        danger: "rgb(var(--harbor-danger) / <alpha-value>)",
        info: "rgb(var(--harbor-info) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--harbor-bg) / <alpha-value>)",
          1: "rgb(var(--harbor-bg-elev-1) / <alpha-value>)",
          2: "rgb(var(--harbor-bg-elev-2) / <alpha-value>)",
          3: "rgb(var(--harbor-bg-elev-3) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--harbor-text) / <alpha-value>)",
          muted: "rgb(var(--harbor-text-muted) / <alpha-value>)",
          subtle: "rgb(var(--harbor-text-subtle) / <alpha-value>)",
        },
      },
      borderRadius: {
        sm: "var(--harbor-radius-sm)",
        md: "var(--harbor-radius-md)",
        lg: "var(--harbor-radius-lg)",
        xl: "var(--harbor-radius-xl)",
        "2xl": "var(--harbor-radius-2xl)",
      },
      boxShadow: {
        "harbor-sm": "var(--harbor-shadow-sm)",
        "harbor-md": "var(--harbor-shadow-md)",
        "harbor-lg": "var(--harbor-shadow-lg)",
        "harbor-glow": "var(--harbor-shadow-glow)",
      },
      transitionDuration: {
        instant: "var(--harbor-dur-instant)",
        fast: "var(--harbor-dur-fast)",
        base: "var(--harbor-dur-base)",
        slow: "var(--harbor-dur-slow)",
        slower: "var(--harbor-dur-slower)",
      },
      transitionTimingFunction: {
        out: "var(--harbor-ease-out)",
        "in-out": "var(--harbor-ease-in-out)",
        spring: "var(--harbor-ease-spring)",
      },
      fontFamily: {
        sans: [
          "InterVariable",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      screens: {
        /* Kept aligned with --harbor-bp-* in tokens.css */
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      animation: {
        "breathe": "breathe 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "mesh": "mesh 18s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        mesh: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 30px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};
