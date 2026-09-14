import { assertStrictEquals, assertThrows } from "@std/assert";
import {
  formatOpacity,
  hexToOpacity,
  opacityToHex,
} from "@tksh/group-colors-param-codec";

// Vectors transcribed from pfpg's src/js/color-formatter/*.js.
Deno.test("opacityToHex rounds to the nearest byte", () => {
  assertStrictEquals(opacityToHex(1), "FF");
  assertStrictEquals(opacityToHex(0.8), "CC");
  assertStrictEquals(opacityToHex(0.01), "03");
  assertStrictEquals(opacityToHex(0), "00");
  // Half values round up: round(0.5 * 255) === 128.
  assertStrictEquals(opacityToHex(0.5), "80");
  assertThrows(() => opacityToHex(2), Error);
  assertThrows(() => opacityToHex(-0.1), Error);
  assertThrows(() => opacityToHex(Number.NaN), Error);
});

Deno.test("hexToOpacity keeps two decimals", () => {
  assertStrictEquals(hexToOpacity("FF"), 1);
  assertStrictEquals(hexToOpacity("CC"), 0.8);
  assertStrictEquals(hexToOpacity("03"), 0.01);
  assertStrictEquals(hexToOpacity("00"), 0);
  assertStrictEquals(hexToOpacity("99"), 0.6);
  assertStrictEquals(hexToOpacity("88"), 0.53);
  assertThrows(() => hexToOpacity("F"), Error);
});

Deno.test("formatOpacity renders SVG/state opacity strings", () => {
  assertStrictEquals(formatOpacity(1), "1.0");
  assertStrictEquals(formatOpacity(0), "0.0");
  assertStrictEquals(formatOpacity(0.5), "0.5");
  assertStrictEquals(formatOpacity(0.8), "0.8");
});
