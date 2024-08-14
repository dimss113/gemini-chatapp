import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: {
          light: "#3758F9",
          medium: "#2c46c7"
        },
        secondary: {
          slate: "#DFE4EA",
          slateDark: "#637381",
          red: "#D64937",
          redDark: "#C53030"
        },
        dark: "#1A202C",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        disappear: 'disappear 0.5s forwards',
      },
      keyframes: {
        disappear: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
export default config;
