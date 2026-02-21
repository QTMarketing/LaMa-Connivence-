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
      // 8px Grid Spacing System
      spacing: {
        'section-xs': '2rem',   // 32px - Small sections
        'section-sm': '3rem',   // 48px - Standard sections
        'section-md': '4rem',   // 64px - Medium sections
        'section-lg': '5rem',   // 80px - Large sections
        'section-xl': '6rem',   // 96px - Extra large sections
      },
      // Typography Scale
      fontSize: {
        'display': ['clamp(2.5rem, 8vw, 4rem)', { lineHeight: '1.1', fontWeight: '900' }],
        'h1': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'h2': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '800' }],
        'h3': ['clamp(1.25rem, 3vw, 1.875rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '700' }],
        'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      // Border Radius Scale (8px grid)
      borderRadius: {
        'xs': '0.25rem',   // 4px
        'sm': '0.375rem',  // 6px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.625rem',  // 10px
        'lg': '0.75rem',   // 12px
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
      },
    },
  },
  plugins: [],
};
export default config;

