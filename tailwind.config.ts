import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        "primary-dark": "#E55A2B",
        secondary: "#1A1A1A",
        background: {
          white: "#FFFFFF",
          light: "#F7F7F7",
          dark: "#1A1A1A",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#4A5568",
          light: "#FFFFFF",
        },
        border: {
          light: "#E2E8F0",
          hover: "#FF6B35",
        },
      },
    },
  },
  plugins: [],
};
export default config;

