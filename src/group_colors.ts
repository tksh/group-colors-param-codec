/**
 * Canonical group-color parameter codec.
 *
 * One group's stroke settings are five bytes, written as ten hex digits:
 *
 * ```text
 *   RR GG BB OO SS
 *   └── stroke ──┘ │  └── stroke-opacity
 *                  └── opacity
 * ```
 *
 * For URL and state parameters that value is shortened to the shortest of the
 * 10 / 6 / 5 / 3 / 1-character forms:
 *
 * - 10 → 6: drop both trailing `FF` opacities when the stroke is opaque
 * - 10 → 5: collapse every repeated byte pair into one digit
 * - 5 → 3: drop both trailing `F` opacities when the stroke is opaque
 * - 3 → 1: collapse `RGB` to one digit when all three digits match
 *
 * This module handles a single value only. Joining or splitting several groups
 * with `_` is the caller's business.
 */
import { assertHexDigits } from "./hex.ts";

const TEN_DIGITS = 10;
const SHORT_LENGTHS = new Set([1, 3, 5, 6, 10]);

function doubled(hex: string): string {
  let result = "";
  for (const char of hex) result += char + char;
  return result;
}

function assertLength(value: string, length: number, name: string): void {
  if (value.length !== length) {
    throw new Error(
      `${name}: expected ${length} hex digits, got ${value.length}`,
    );
  }
}

/**
 * Shorten a 10-digit `RRGGBB` + opacity + stroke-opacity value to its shortest
 * 10 / 6 / 5 / 3 / 1-character form.
 *
 * Output is always uppercase; input is matched case-insensitively. Any other
 * length throws.
 */
export function shortenGroupColor(tenDigitsHex: string): string {
  assertLength(tenDigitsHex, TEN_DIGITS, "shortenGroupColor");
  assertHexDigits(tenDigitsHex, "shortenGroupColor");
  const hex = tenDigitsHex.toUpperCase();

  let compact = "";
  for (let i = 0; i < hex.length; i += 2) {
    const first = hex[i] as string;
    const second = hex[i + 1] as string;
    if (first !== second) {
      compact = "";
      break;
    }
    compact += first;
  }

  if (compact !== "") {
    if (compact[3] === "F" && compact[4] === "F") {
      compact = compact.slice(0, -2);
      const r = compact[0] as string;
      const g = compact[1] as string;
      const b = compact[2] as string;
      if (r === g && g === b) return r;
    }
    return compact;
  }

  return hex.slice(6) === "FFFF" ? hex.slice(0, 6) : hex;
}

/**
 * Expand a shortened group-color value (10 / 6 / 5 / 3 / 1 characters) back to
 * ten digits, restoring omitted opacities as `FF` (fully opaque).
 *
 * Output is always uppercase; input is matched case-insensitively. Any other
 * length throws.
 */
export function expandGroupColor(shortHex: string): string {
  if (!SHORT_LENGTHS.has(shortHex.length)) {
    throw new Error(
      `expandGroupColor: expected 1, 3, 5, 6, or 10 hex digits, got ${shortHex.length}`,
    );
  }
  assertHexDigits(shortHex, "expandGroupColor");
  const hex = shortHex.toUpperCase();

  switch (hex.length) {
    case TEN_DIGITS:
      return hex;
    case 6:
      return hex + "FFFF";
    case 5:
      return doubled(hex);
    case 3:
      return doubled(hex) + "FFFF";
    default:
      return hex.repeat(6) + "FFFF";
  }
}
