import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f2fde4",
          100: "#e1f9c3",
          200: "#c4f288",
          300: "#a0e84d",
          400: "#65e42a",
          500: "#4aca14",
          600: "#38a10e",
          700: "#2b7b0e",
          800: "#25620f",
          900: "#1f5110",
          950: "#0e2d04",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
      },
      height: { "13": "3.25rem" },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
      },
      animation: {
        "dot-bounce": "dot-bounce 1.1s ease-in-out infinite",
        "fade-up":    "fade-up    0.3s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":    "fade-in    0.2s ease-out both",
        "scale-in":   "scale-in   0.2s cubic-bezier(0.16,1,0.3,1) both",
        "slide-down": "slide-down 0.2s cubic-bezier(0.16,1,0.3,1) both",
        "shimmer":    "shimmer    1.6s ease-in-out infinite",
      },
      keyframes: {
        "dot-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)",    opacity: "0.3" },
          "30%":           { transform: "translateY(-4px)", opacity: "1"   },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)"    },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: " 400px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
