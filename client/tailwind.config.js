const { tailwindColors } = require("./src/theme/tokens");
const { tailwindBorderRadius } = require("./src/theme/radius");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: tailwindColors,
      borderRadius: tailwindBorderRadius,
    },
  },

  plugins: [],
};
