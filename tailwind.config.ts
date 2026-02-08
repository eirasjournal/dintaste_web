import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- This now covers dreams, robotics, and everything else in app
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // In case you have a root components folder
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Re-adding your custom colors here just in case
        dream: {
          accent: "#d499ff", 
          bg: "#050505",
        }
      },
    },
  },
  plugins: [],
};
export default config;