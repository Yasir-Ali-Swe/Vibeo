/**
 * Shadcn-style neutral palette (source of truth converted from OKLCH to sRGB hex)
 */
const lightPalette = {
  background: "#FFFFFF",
  foreground: {
    DEFAULT: "#0A0A0A",
    muted: "#525252",
  },
  card: {
    DEFAULT: "#FFFFFF",
    foreground: "#0A0A0A",
  },
  surface: {
    DEFAULT: "#FFFFFF",
    elevated: "#F5F5F5",
    muted: "#F5F5F5",
  },
  primary: {
    DEFAULT: "#171717",
    foreground: "#FAFAFA",
    light: "#262626",
    dark: "#0A0A0A",
  },
  secondary: {
    DEFAULT: "#F5F5F5",
    foreground: "#171717",
  },
  muted: {
    DEFAULT: "#F5F5F5",
    foreground: "#737373",
    subtle: "#A1A1A1",
  },
  border: {
    DEFAULT: "#E5E5E5",
    subtle: "#E5E5E5",
    strong: "#D4D4D4",
  },
  input: "#E5E5E5",
  ring: "#A1A1A1",
  destructive: {
    DEFAULT: "#E7000B",
    foreground: "#FFFFFF",
  },
  success: {
    DEFAULT: "#15803D",
    foreground: "#FFFFFF",
  },
  warning: {
    DEFAULT: "#B45309",
    foreground: "#FFFFFF",
    star: "#FBBF24",
  },
  info: {
    DEFAULT: "#2563EB",
    foreground: "#FFFFFF",
  },
  popover: {
    DEFAULT: "#FFFFFF",
    foreground: "#0A0A0A",
  },
  accent: {
    DEFAULT: "#F5F5F5",
    foreground: "#171717",
  },
  chart: {
    1: "#91C5FF",
    2: "#3A81F6",
    3: "#2563EF",
    4: "#1A4EDA",
    5: "#1F3FAD",
  },
  sidebar: {
    DEFAULT: "#FAFAFA",
    foreground: "#0A0A0A",
    primary: {
      DEFAULT: "#171717",
      foreground: "#FAFAFA",
    },
    accent: {
      DEFAULT: "#F5F5F5",
      foreground: "#171717",
    },
    border: "#E5E5E5",
    ring: "#A1A1A1",
  },
};

const darkPalette = {
  background: "#0A0A0A",
  foreground: {
    DEFAULT: "#FAFAFA",
    muted: "#D4D4D4",
  },
  card: {
    DEFAULT: "#171717",
    foreground: "#FAFAFA",
  },
  surface: {
    DEFAULT: "#171717",
    elevated: "#262626",
    muted: "#404040",
  },
  primary: {
    DEFAULT: "#E5E5E5",
    foreground: "#171717",
    light: "#FAFAFA",
    dark: "#CCCCCC",
  },
  secondary: {
    DEFAULT: "#262626",
    foreground: "#FAFAFA",
  },
  muted: {
    DEFAULT: "#262626",
    foreground: "#A1A1A1",
    subtle: "#737373",
  },
  border: {
    DEFAULT: "#282828",
    subtle: "#282828",
    strong: "#343434",
  },
  input: "#343434",
  ring: "#737373",
  destructive: {
    DEFAULT: "#FF6467",
    foreground: "#FAFAFA",
  },
  success: {
    DEFAULT: "#22C55E",
    foreground: "#FFFFFF",
  },
  warning: {
    DEFAULT: "#F59E0B",
    foreground: "#0A0A0A",
    star: "#FBBF24",
  },
  info: {
    DEFAULT: "#3B82F6",
    foreground: "#FFFFFF",
  },
  popover: {
    DEFAULT: "#262626",
    foreground: "#FAFAFA",
  },
  accent: {
    DEFAULT: "#404040",
    foreground: "#FAFAFA",
  },
  chart: {
    1: "#91C5FF",
    2: "#3A81F6",
    3: "#2563EF",
    4: "#1A4EDA",
    5: "#1F3FAD",
  },
  sidebar: {
    DEFAULT: "#171717",
    foreground: "#FAFAFA",
    primary: {
      DEFAULT: "#1447E6",
      foreground: "#FAFAFA",
    },
    accent: {
      DEFAULT: "#262626",
      foreground: "#FAFAFA",
    },
    border: "#282828",
    ring: "#525252",
  },
};

module.exports = {
  lightPalette,
  darkPalette,
};

