import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nebula: {
          bg: "#050816",
          soft: "#12091d",
          panel: "#120d21",
          line: "#38244b",
          accent: "#d88cff",
          signal: "#87ffd8",
          muted: "#c1b3d8",
          warning: "#ffc57a",
          danger: "#ff7f96",
        },
      },
      fontFamily: {
        sans: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        halo: "0 0 0 1px rgba(216, 140, 255, 0.12), 0 30px 80px rgba(3, 8, 20, 0.52)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(216, 140, 255, 0.24), transparent 32%), radial-gradient(circle at 30% 30%, rgba(135, 255, 216, 0.14), transparent 18%)",
      },
    },
  },
  plugins: [],
};

export default config;
