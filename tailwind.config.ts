import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172218",
        cream: "#f6f7f2",
        moss: { 50: "#f0f5ef", 100: "#dce8d9", 400: "#79a76f", 500: "#5f8e57", 700: "#3e6439", 900: "#244020" },
        lime: "#d7ff64",
        sand: "#e8e7dc"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(30, 48, 30, 0.08)",
        card: "0 1px 2px rgba(24,34,24,.04), 0 12px 32px rgba(24,34,24,.06)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
