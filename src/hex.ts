/**
 * Hex-string primitives shared by the group-color codec.
 *
 * Every function here is pure and string-level: no color objects, no DOM. Input
 * may be written in any casing; output is always uppercase so the canonical
 * form never depends on the caller.
 */

const HEX_DIGITS = /^[0-9A-Fa-f]+$/;

/** Throw unless `value` is a non-empty run of hex digits. */
export function assertHexDigits(value: string, name: string): void {
  if (value.length === 0 || !HEX_DIGITS.test(value)) {
    throw new Error(
      `${name}: expected hex digits, got ${JSON.stringify(value)}`,
    );
  }
}

function doubled(hex: string): string {
  let result = "";
  for (const char of hex) result += char + char;
  return result;
}

/** Remove a leading `#`, if present. */
export function removeHash(hex: string): string {
  return hex.startsWith("#") ? hex.slice(1) : hex;
}

/** Add a leading `#`, if missing. */
export function addHash(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

/**
 * Expand a 3- or 6-digit RGB hex value to 6 uppercase digits.
 *
 * A 3-digit value repeats each digit (`"abc"` → `"AABBCC"`); a 6-digit value is
 * uppercased. Any other input throws.
 */
export function expandHexToSix(hex: string): string {
  const digits = removeHash(hex);
  if (digits.length !== 3 && digits.length !== 6) {
    throw new Error(
      `expandHexToSix: expected 3 or 6 hex digits, got ${JSON.stringify(hex)}`,
    );
  }
  assertHexDigits(digits, "expandHexToSix");
  return (digits.length === 3 ? doubled(digits) : digits).toUpperCase();
}

/**
 * Halve a hex value when every two-digit pair repeats, else return it as-is.
 *
 * `"ABC"` and `"AABBCC"` both collapse to `"ABC"`; `"FFFFFE"` is returned
 * unchanged because its last pair differs. Output is always uppercase.
 */
export function shortenHexAsHalf(hex: string): string {
  if (hex.length === 0 || hex.length % 2 !== 0) {
    throw new Error(
      `shortenHexAsHalf: expected an even number of hex digits, got ${
        JSON.stringify(hex)
      }`,
    );
  }
  assertHexDigits(hex, "shortenHexAsHalf");
  const upper = hex.toUpperCase();
  let compact = "";
  for (let i = 0; i < upper.length; i += 2) {
    const first = upper[i];
    const second = upper[i + 1];
    if (first !== second) return upper;
    compact += first;
  }
  return compact;
}
