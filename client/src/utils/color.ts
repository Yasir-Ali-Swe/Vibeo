/**
 * Adds transparency to a 6-digit hex color, e.g. withAlpha("#22C55E", 0.15)
 */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

