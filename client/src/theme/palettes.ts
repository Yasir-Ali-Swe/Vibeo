import type { Palette } from "./palette";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { lightPalette, darkPalette } = require("./palettes.js") as {
  lightPalette: Palette;
  darkPalette: Palette;
};

export const lightColors: Palette = lightPalette;
export const darkColors: Palette = darkPalette;
export type { Palette } from "./palette";

