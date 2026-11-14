// Pure helper to convert #RRGGBB or #RGB hex string to "r g b" channels
function hexToRgbChannels(hex) {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
        .split("")
        .map((c) => c + c)
        .join("")
      : clean.slice(0, 6);
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

// Convert palette into a flat map of CSS variables: { "--color-background": "255 255 255", ... }
function getThemeCssVariables(palette) {
  return {
    "--color-background": hexToRgbChannels(palette.background),
    "--color-foreground": hexToRgbChannels(palette.foreground.DEFAULT),
    "--color-foreground-muted": hexToRgbChannels(palette.foreground.muted),

    "--color-card": hexToRgbChannels(palette.card.DEFAULT),
    "--color-card-foreground": hexToRgbChannels(palette.card.foreground),

    "--color-surface": hexToRgbChannels(palette.surface.DEFAULT),
    "--color-surface-elevated": hexToRgbChannels(palette.surface.elevated),
    "--color-surface-muted": hexToRgbChannels(palette.surface.muted),

    "--color-primary": hexToRgbChannels(palette.primary.DEFAULT),
    "--color-primary-foreground": hexToRgbChannels(palette.primary.foreground),
    "--color-primary-light": hexToRgbChannels(palette.primary.light),
    "--color-primary-dark": hexToRgbChannels(palette.primary.dark),

    "--color-secondary": hexToRgbChannels(palette.secondary.DEFAULT),
    "--color-secondary-foreground": hexToRgbChannels(palette.secondary.foreground),

    "--color-muted": hexToRgbChannels(palette.muted.DEFAULT),
    "--color-muted-foreground": hexToRgbChannels(palette.muted.foreground),
    "--color-muted-subtle": hexToRgbChannels(palette.muted.subtle),

    "--color-border": hexToRgbChannels(palette.border.DEFAULT),
    "--color-border-subtle": hexToRgbChannels(palette.border.subtle),
    "--color-border-strong": hexToRgbChannels(palette.border.strong),

    "--color-input": hexToRgbChannels(palette.input),
    "--color-ring": hexToRgbChannels(palette.ring),

    "--color-destructive": hexToRgbChannels(palette.destructive.DEFAULT),
    "--color-destructive-foreground": hexToRgbChannels(palette.destructive.foreground),

    "--color-success": hexToRgbChannels(palette.success.DEFAULT),
    "--color-success-foreground": hexToRgbChannels(palette.success.foreground),

    "--color-warning": hexToRgbChannels(palette.warning.DEFAULT),
    "--color-warning-foreground": hexToRgbChannels(palette.warning.foreground),
    "--color-warning-star": hexToRgbChannels(palette.warning.star),

    "--color-info": hexToRgbChannels(palette.info.DEFAULT),
    "--color-info-foreground": hexToRgbChannels(palette.info.foreground),

    "--color-popover": hexToRgbChannels(palette.popover.DEFAULT),
    "--color-popover-foreground": hexToRgbChannels(palette.popover.foreground),

    "--color-accent": hexToRgbChannels(palette.accent.DEFAULT),
    "--color-accent-foreground": hexToRgbChannels(palette.accent.foreground),

    "--color-chart-1": hexToRgbChannels(palette.chart["1"]),
    "--color-chart-2": hexToRgbChannels(palette.chart["2"]),
    "--color-chart-3": hexToRgbChannels(palette.chart["3"]),
    "--color-chart-4": hexToRgbChannels(palette.chart["4"]),
    "--color-chart-5": hexToRgbChannels(palette.chart["5"]),

    "--color-sidebar": hexToRgbChannels(palette.sidebar.DEFAULT),
    "--color-sidebar-foreground": hexToRgbChannels(palette.sidebar.foreground),
    "--color-sidebar-primary": hexToRgbChannels(palette.sidebar.primary.DEFAULT),
    "--color-sidebar-primary-foreground": hexToRgbChannels(palette.sidebar.primary.foreground),
    "--color-sidebar-accent": hexToRgbChannels(palette.sidebar.accent.DEFAULT),
    "--color-sidebar-accent-foreground": hexToRgbChannels(palette.sidebar.accent.foreground),
    "--color-sidebar-border": hexToRgbChannels(palette.sidebar.border),
    "--color-sidebar-ring": hexToRgbChannels(palette.sidebar.ring),
  };
}

// Semantic Tailwind colors mapping to CSS variables with <alpha-value> support
const tailwindColors = {
  background: "rgb(var(--color-background) / <alpha-value>)",
  foreground: {
    DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
    muted: "rgb(var(--color-foreground-muted) / <alpha-value>)",
  },

  card: {
    DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
    foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
  },

  surface: {
    DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
    elevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
    muted: "rgb(var(--color-surface-muted) / <alpha-value>)",
  },

  primary: {
    DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
    foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
    light: "rgb(var(--color-primary-light) / <alpha-value>)",
    dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
  },

  secondary: {
    DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
    foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
  },

  muted: {
    DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
    foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
    subtle: "rgb(var(--color-muted-subtle) / <alpha-value>)",
  },

  border: {
    DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
    subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
    strong: "rgb(var(--color-border-strong) / <alpha-value>)",
  },

  input: "rgb(var(--color-input) / <alpha-value>)",

  ring: "rgb(var(--color-ring) / <alpha-value>)",

  destructive: {
    DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
    foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)",
  },

  success: {
    DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
    foreground: "rgb(var(--color-success-foreground) / <alpha-value>)",
  },

  warning: {
    DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
    foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)",
    star: "rgb(var(--color-warning-star) / <alpha-value>)",
  },

  info: {
    DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
    foreground: "rgb(var(--color-info-foreground) / <alpha-value>)",
  },

  popover: {
    DEFAULT: "rgb(var(--color-popover) / <alpha-value>)",
    foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)",
  },

  accent: {
    DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
    foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
  },

  chart: {
    1: "rgb(var(--color-chart-1) / <alpha-value>)",
    2: "rgb(var(--color-chart-2) / <alpha-value>)",
    3: "rgb(var(--color-chart-3) / <alpha-value>)",
    4: "rgb(var(--color-chart-4) / <alpha-value>)",
    5: "rgb(var(--color-chart-5) / <alpha-value>)",
  },

  sidebar: {
    DEFAULT: "rgb(var(--color-sidebar) / <alpha-value>)",
    foreground: "rgb(var(--color-sidebar-foreground) / <alpha-value>)",
    primary: {
      DEFAULT: "rgb(var(--color-sidebar-primary) / <alpha-value>)",
      foreground: "rgb(var(--color-sidebar-primary-foreground) / <alpha-value>)",
    },
    accent: {
      DEFAULT: "rgb(var(--color-sidebar-accent) / <alpha-value>)",
      foreground: "rgb(var(--color-sidebar-accent-foreground) / <alpha-value>)",
    },
    border: "rgb(var(--color-sidebar-border) / <alpha-value>)",
    ring: "rgb(var(--color-sidebar-ring) / <alpha-value>)",
  },
};

module.exports = {
  hexToRgbChannels,
  getThemeCssVariables,
  tailwindColors,
};
