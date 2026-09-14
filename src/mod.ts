/**
 * group-colors-param-codec: a standards-agnostic codec for line-group color
 * parameters.
 *
 * A group's `stroke`, `opacity`, and `stroke-opacity` travel as a single
 * ten-digit hex value (`RRGGBB` + opacity + stroke-opacity) that is shortened
 * to its shortest 10 / 6 / 5 / 3 / 1-character form for URLs and UI state.
 * Joining several groups with `_` is left to the caller.
 *
 * The package is pure and string-level: no DOM, no SVG types, no runtime
 * dependencies.
 */
export {
  addHash,
  expandHexToSix,
  removeHash,
  shortenHexAsHalf,
} from "./hex.ts";
export {
  hexToRgb,
  hexToUint8,
  type Rgb,
  rgbToHex,
  rgbToString,
  uint8ToHex,
} from "./rgb.ts";
export { formatOpacity, hexToOpacity, opacityToHex } from "./opacity.ts";
export { expandGroupColor, shortenGroupColor } from "./group_colors.ts";
