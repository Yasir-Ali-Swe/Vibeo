// Single source of truth for border-radius design tokens
const radius = {
  xs: 6,     // tiny tags, small inline badges
  sm: 8,     // small badges, thumbnails, small chips
  md: 12,    // buttons, inputs, selectable options (variant chips, filter rows), icon tiles
  lg: 16,    // cards, list items, panels, grouped sections, image tiles, banners
  xl: 20,    // hero banners, large feature cards, bottom sheets (top corners)
  full: 9999, // pills, avatars, circular icon buttons, dots, pagination indicators, count bubbles
};

// Tailwind class name mapping
// Overriding md, lg, xl ensures any stray Tailwind class maps predictably to the design token scale
const tailwindBorderRadius = {
  none: "0px",
  xs: `${radius.xs}px`,     // rounded-xs = 6px
  sm: `${radius.sm}px`,     // rounded-sm = 8px
  md: `${radius.md}px`,     // rounded-md = 12px (buttons, inputs, option chips)
  lg: `${radius.lg}px`,     // rounded-lg = 16px (cards, panels, list items)
  xl: `${radius.xl}px`,     // rounded-xl = 20px (hero banner, large feature cards)
  "2xl": `${radius.xl}px`,  // rounded-2xl mapped to xl (20px)
  "3xl": "24px",
  full: `${radius.full}px`, // rounded-full = 9999px (pills, circles, avatars, dots)
};

module.exports = {
  radius,
  tailwindBorderRadius,
};

