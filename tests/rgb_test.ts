import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";
import {
  hexToRgb,
  hexToUint8,
  rgbToHex,
  rgbToString,
  uint8ToHex,
} from "@tksh/group-colors-param-codec";

Deno.test("uint8 conversions round-trip", () => {
  assertStrictEquals(uint8ToHex(0), "00");
  assertStrictEquals(uint8ToHex(1), "01");
  assertStrictEquals(uint8ToHex(255), "FF");
  assertStrictEquals(hexToUint8("00"), 0);
  assertStrictEquals(hexToUint8("FF"), 255);
  assertThrows(() => uint8ToHex(256), Error);
  assertThrows(() => uint8ToHex(1.5), Error);
  assertThrows(() => hexToUint8("F"), Error);
  assertThrows(() => hexToUint8("GG"), Error);
});

Deno.test("rgb helpers convert between hex, objects, and strings", () => {
  assertStrictEquals(rgbToHex({ r: 0, g: 0, b: 0 }), "000000");
  assertStrictEquals(rgbToHex({ r: 170, g: 170, b: 170 }), "AAAAAA");
  assertStrictEquals(rgbToHex({ r: 255, g: 255, b: 255 }), "FFFFFF");
  assertThrows(() => rgbToHex({ r: 256, g: 0, b: 0 }), Error);
  assertEquals(hexToRgb("000000"), { r: 0, g: 0, b: 0 });
  assertEquals(hexToRgb("FFFFFF"), { r: 255, g: 255, b: 255 });
  assertEquals(hexToRgb("FF8000"), { r: 255, g: 128, b: 0 });
  assertEquals(hexToRgb("#fff"), { r: 255, g: 255, b: 255 });
  assertThrows(() => hexToRgb("zzzzzz"), Error);
  assertStrictEquals(
    rgbToString({ r: 255, g: 255, b: 255 }),
    "rgb(255 255 255)",
  );
  assertStrictEquals(rgbToString({ r: 0, g: 0, b: 0 }), "rgb(0 0 0)");
});
