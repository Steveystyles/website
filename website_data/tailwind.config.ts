import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        smfc: {
          black: "#0B0B0B",
          charcoal: "#141414",
          grey: "#2A2A2A",
          white: "#FFFFFF",
          red: "#C8102E",
        },
      },
    },
  },
  plugins: [],
}

export default config
