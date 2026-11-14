export interface Palette {
  background: string;
  foreground: {
    DEFAULT: string;
    muted: string;
  };
  card: {
    DEFAULT: string;
    foreground: string;
  };
  surface: {
    DEFAULT: string;
    elevated: string;
    muted: string;
  };
  primary: {
    DEFAULT: string;
    foreground: string;
    light: string;
    dark: string;
  };
  secondary: {
    DEFAULT: string;
    foreground: string;
  };
  muted: {
    DEFAULT: string;
    foreground: string;
    subtle: string;
  };
  border: {
    DEFAULT: string;
    subtle: string;
    strong: string;
  };
  input: string;
  ring: string;
  destructive: {
    DEFAULT: string;
    foreground: string;
  };
  success: {
    DEFAULT: string;
    foreground: string;
  };
  warning: {
    DEFAULT: string;
    foreground: string;
    star: string;
  };
  info: {
    DEFAULT: string;
    foreground: string;
  };
  popover: {
    DEFAULT: string;
    foreground: string;
  };
  accent: {
    DEFAULT: string;
    foreground: string;
  };
  chart: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  sidebar: {
    DEFAULT: string;
    foreground: string;
    primary: {
      DEFAULT: string;
      foreground: string;
    };
    accent: {
      DEFAULT: string;
      foreground: string;
    };
    border: string;
    ring: string;
  };
}
