import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        correct: "#00ff88",
        misplaced: "#f59e0b",
        wrong: "#3a3a4a",
        "bg-primary": "#0a0a0f",
        "bg-tile": "#1a1a2e",
        "bg-key": "#2a2a3e",
        border: "#2a2a3e",
      },
      animation: {
        flip: "flip 0.6s ease-in-out",
        shake: "shake 0.5s ease-in-out",
        "pop-in": "popIn 0.1s ease-in-out",
        bounce: "bounceIn 0.3s ease",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
