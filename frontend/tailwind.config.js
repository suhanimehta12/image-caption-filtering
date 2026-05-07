/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        heading: ["'Exo 2'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      colors: {
        bg: "#04050c",
        surface: "#090b18",
        card: "#0e1020",
        border: "#1a1d35",
        "border-bright": "#2a2d50",
        primary: "#4fffb0",
        "primary-dim": "#1a6644",
        secondary: "#ff6b6b",
        accent: "#7b61ff",
        muted: "#4a4d6a",
        "text-primary": "#e8eaf6",
        "text-secondary": "#8b8fa8",
      },
      boxShadow: {
        glow: "0 0 20px rgba(79, 255, 176, 0.15)",
        "glow-lg": "0 0 40px rgba(79, 255, 176, 0.2)",
        "glow-accent": "0 0 20px rgba(123, 97, 255, 0.2)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 4s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
