import type { Palette } from "./palette";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getThemeCssVariables, hexToRgbChannels, tailwindColors } = require("./tokens.js");

export { hexToRgbChannels, tailwindColors };

export function getCssVariablesForPalette(palette: Palette): Record<string, string> {
  return getThemeCssVariables(palette);
}

