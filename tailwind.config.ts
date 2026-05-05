import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--surface)",
        foreground: "var(--fg)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        card: "var(--card)",
      },
    },
  },
  plugins: [],
};

export default config;
