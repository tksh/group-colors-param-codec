/**
 * RGB channel conversions for group-color parameters.
 *
 * Colors travel as `#RRGGBB` strings; this module converts between that wire
 * form, 8-bit channel objects, and the `rgb(r g b)` presentation form.
 */
import { expandHexToSix } from "./hex.ts";

/** 8-bit RGB triplet, e.g. `{ r: 255, g: 255, b: 255 }`. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const TWO_HEX_DIGITS = /^[0-9A-Fa-f]{2}$/;

/** Parse a 2-digit hex string into an integer in `0..255`. */
export function hexToUint8(hex: string): number {
  if (!TWO_HEX_DIGITS.test(hex)) {
    throw new Error(
      `hexToUint8: expected 2 hex digits, got ${JSON.stringify(hex)}`,
    );
  }
  return Number.parseInt(hex, 16);
}

/** Format an integer in `0..255` as 2 uppercase hex digits. */
export function uint8ToHex(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`uint8ToHex: out of range ${value}`);
  }
  return value.toString(16).padStart(2, "0").toUpperCase();
}

/**
 * Parse a 3- or 6-digit RGB hex value (with or without a leading `#`) into an
 * 8-bit channel object.
 */
export function hexToRgb(hex: string): Rgb {
  const digits = expandHexToSix(hex);
  return {
    r: hexToUint8(digits.slice(0, 2)),
    g: hexToUint8(digits.slice(2, 4)),
    b: hexToUint8(digits.slice(4, 6)),
  };
}

/** Format an 8-bit RGB triplet as 6 uppercase hex digits (without `#`). */
export function rgbToHex(rgb: Rgb): string {
  return uint8ToHex(rgb.r) + uint8ToHex(rgb.g) + uint8ToHex(rgb.b);
}

/** Format an 8-bit RGB triplet as the space-separated `rgb(r g b)` form. */
export function rgbToString(rgb: Rgb): string {
  return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
}
