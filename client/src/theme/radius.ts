export const radius = {
  xs: 6,     // tiny tags, small inline badges
  sm: 8,     // small badges, thumbnails, small chips
  md: 12,    // buttons, inputs, selectable options (variant chips, filter rows), icon tiles
  lg: 16,    // cards, list items, panels, grouped sections, image tiles, banners
  xl: 20,    // hero banners, large feature cards, bottom sheets (top corners)
  full: 9999, // pills, avatars, circular icon buttons, dots, pagination indicators, count bubbles
} as const;

export type RadiusScale = typeof radius;
export type RadiusToken = keyof RadiusScale;

