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
        background: "#000000",
        card: "#111111",
        "card-border": "#1a1a1a",
        "card-hover": "#1c1c1c",
        accent: {
          DEFAULT: "#F5C518",
          light: "#FFD84D",
          dark: "#D4A800",
        },
        "text-primary": "#ffffff",
        "text-secondary": "#b3b3b3",
        "text-muted": "#666666",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
