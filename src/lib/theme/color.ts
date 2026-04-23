/**
 * Harbor stores color tokens as space-separated RGB triplets
 * ("168 85 247") because that's the format Tailwind's
 * `rgb(var(--name) / <alpha-value>)` expansion needs.
 *
 * For ergonomics, `defineTheme` lets authors write colors in whichever
 * format their brand guidelines use — this module normalises to the
 * triplet form so the rest of the pipeline stays uniform.
 *
 * Supported inputs:
 *   - triplet:  "168 85 247"           (pass-through)
 *   - hex:      "#FF6B35", "#F63"      (converted)
 *   - rgb/rgba: "rgb(255, 107, 53)"    (channels extracted)
 *   - var() references                 (pass-through; one token can
 *                                       point to another via CSS var)
 */

const TRIPLET = /^\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*$/;
const HEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
const RGB = /^\s*rgba?\s*\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/i;
const CSS_VAR = /^\s*var\s*\(/;

function clampByte(n: number): number {
  if (n < 0) return 0;
  if (n > 255) return 255;
  return Math.round(n);
}

/**
 * Normalises a color string to a `"r g b"` triplet. Returns the input
 * unchanged if it is a `var(...)` reference (supports aliasing one
 * token to another) or if the format is unrecognised — in dev, the
 * latter logs a warning so typos surface early.
 */
export function normalizeColor(input: string): string {
  if (CSS_VAR.test(input)) return input.trim();

  const tripletMatch = input.match(TRIPLET);
  if (tripletMatch) {
    return `${clampByte(+tripletMatch[1])} ${clampByte(+tripletMatch[2])} ${clampByte(+tripletMatch[3])}`;
  }

  const hexMatch = input.trim().match(HEX);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  }

  const rgbMatch = input.match(RGB);
  if (rgbMatch) {
    return `${clampByte(+rgbMatch[1])} ${clampByte(+rgbMatch[2])} ${clampByte(+rgbMatch[3])}`;
  }

  if (import.meta.env?.DEV) {
    console.warn(
      `[Harbor] normalizeColor: unrecognised color "${input}". ` +
        `Use a hex ("#RRGGBB"), rgb() string, or RGB triplet ("168 85 247").`,
    );
  }
  return input;
}
