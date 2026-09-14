/**
 * Opacity conversions for group-color parameters.
 *
 * Group colors carry opacity as a single hex byte. Callers work with a
 * normalized `0..1` float, so this module fixes the one rounding rule used on
 * both sides:
 *
 * - float → hex: `round(opacity * 255)`, half values rounding up
 * - hex → float: `round(hex / 255 * 100) / 100`, i.e. two decimals
 *
 * The asymmetric precision is intentional: two decimals match the UI's
 * `opacitySteps` display, while hex output stays exact for any float the UI can
 * produce from a decoded byte.
 */
import { hexToUint8 } from "./rgb.ts";

/** Convert a normalized `0..1` opacity to 2 uppercase hex digits. */
export function opacityToHex(opacity: number): string {
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
    throw new Error(`opacityToHex: expected a 0..1 value, got ${opacity}`);
  }
  return Math.round(opacity * 255).toString(16).padStart(2, "0").toUpperCase();
}

/** Convert a 2-digit hex opacity to a normalized `0..1` value (two decimals). */
export function hexToOpacity(hex: string): number {
  return Number((hexToUint8(hex) / 255).toFixed(2));
}

/**
 * Render a normalized opacity for SVG/state display: `1` and `0` keep a
 * trailing decimal (`"1.0"`, `"0.0"`), everything else is the plain number.
 */
export function formatOpacity(opacity: number): string {
  if (opacity === 0 || opacity === 1) return opacity.toFixed(1);
  return opacity.toString();
}
