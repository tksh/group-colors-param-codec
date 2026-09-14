import { assertStrictEquals, assertThrows } from "@std/assert";
import {
  addHash,
  expandHexToSix,
  removeHash,
  shortenHexAsHalf,
} from "@tksh/group-colors-param-codec";

Deno.test("hash helpers add or remove a leading hash", () => {
  assertStrictEquals(removeHash("#FFF"), "FFF");
  assertStrictEquals(removeHash("FFF"), "FFF");
  assertStrictEquals(addHash("FFFFFF"), "#FFFFFF");
  assertStrictEquals(addHash("#FFFFFF"), "#FFFFFF");
});

Deno.test("expandHexToSix doubles 3-digit codes and uppercases", () => {
  assertStrictEquals(expandHexToSix("ffffff"), "FFFFFF");
  assertStrictEquals(expandHexToSix("fff"), "FFFFFF");
  assertStrictEquals(expandHexToSix("#fff"), "FFFFFF");
  assertThrows(() => expandHexToSix(""), Error);
  assertThrows(() => expandHexToSix("ff"), Error);
  assertThrows(() => expandHexToSix("ff00ff00"), Error);
});

Deno.test("shortenHexAsHalf halves uniform pairs", () => {
  assertStrictEquals(shortenHexAsHalf("ffffff"), "FFF");
  assertStrictEquals(shortenHexAsHalf("fffffe"), "FFFFFE");
  assertStrictEquals(shortenHexAsHalf("aabbccffff"), "ABCFF");
  assertStrictEquals(shortenHexAsHalf("123456ffff"), "123456FFFF");
  assertThrows(() => shortenHexAsHalf("abc"), Error);
  assertThrows(() => shortenHexAsHalf(""), Error);
});
