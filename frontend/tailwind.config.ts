import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {    
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Royal minimalist black theme
        dark: {
          1: "#0A0A0A", // Deep black
          2: "#000000", // Pure black
          3: "#1A1A1A", // Slightly lighter black
          4: "#252525", // Subtle gray-black
        },
        royal: {
          1: "#6B46C1", // Royal purple (primary)
          2: "#7C3AED", // Bright royal purple
          3: "#8B5CF6", // Light royal purple
          4: "#9333EA", // Vibrant purple
        },
        accent: {
          1: "#6366F1", // Royal indigo
          2: "#4F46E5", // Deep indigo
          3: "#818CF8", // Light indigo
        },
        // Light mode colors
        light: {
          1: "#FFFFFF", // Pure white
          2: "#FAFAFA", // Off-white
          3: "#F5F5F5", // Light gray
          4: "#E5E5E5", // Subtle gray
        },
        // Legacy colors for compatibility (using royal theme)
        blue: {
          1: "#6366F1", // Royal indigo
        },
        sky: {
          1: "#E0E7FF", // Light indigo tint
          2: "#EEF2FF", // Very light indigo
          3: "#F5F7FF", // Almost white with indigo hint
        },
        orange: {
          1: "#F59E0B", // Amber (royal gold alternative)
        },
        purple: {
          1: "#6B46C1", // Royal purple
        },
        yellow: {
          1: "#EAB308", // Gold yellow
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        hero: "url('/images/hero-background.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
