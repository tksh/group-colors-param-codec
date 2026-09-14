import { assertStrictEquals, assertThrows } from "@std/assert";
import {
  expandGroupColor,
  shortenGroupColor,
} from "@tksh/group-colors-param-codec";

Deno.test("shortenGroupColor compresses 10-digit codes to the shortest form", () => {
  const vectors: Array<[string, string]> = [
    // 10 → 5 (every byte pair repeats)
    ["AABBCCFF99", "ABCF9"],
    ["112233ff88", "123F8"],
    ["112233eeee", "123EE"],
    ["1122334455", "12345"],
    // 10 → 3 (byte pairs repeat and both opacities are F)
    ["AABBCCFFff", "ABC"],
    ["112233FFFF", "123"],
    ["AABBCCFFFF", "ABC"],
    // 10 → 1 (uniform color, both opacities F)
    ["111111ffFF", "1"],
    ["AAAAAAFFFF", "A"],
    ["aaaaaaffff", "A"],
    ["FFFFFFFFFF", "F"],
    ["000000ffff", "0"],
    // 10 → 6 (only the trailing opaque opacities drop)
    ["123456ffff", "123456"],
    // 10 stays 10 (no pair repeats, opacities not both F)
    ["AABBCCabcd", "AABBCCABCD"],
  ];
  for (const [input, expected] of vectors) {
    assertStrictEquals(shortenGroupColor(input), expected, input);
  }
});

Deno.test("shortenGroupColor is case-insensitive and always uppercase", () => {
  assertStrictEquals(shortenGroupColor("aabbccff99"), "ABCF9");
  assertStrictEquals(shortenGroupColor("aabbccffFF"), "ABC");
  assertStrictEquals(shortenGroupColor("ffffffffff"), "F");
});

Deno.test("expandGroupColor restores every shortened form to 10 digits", () => {
  assertStrictEquals(expandGroupColor("F"), "FFFFFFFFFF");
  assertStrictEquals(expandGroupColor("0"), "000000FFFF");
  assertStrictEquals(expandGroupColor("abc"), "AABBCCFFFF");
  assertStrictEquals(expandGroupColor("123"), "112233FFFF");
  assertStrictEquals(expandGroupColor("abcde"), "AABBCCDDEE");
  assertStrictEquals(expandGroupColor("ffffff"), "FFFFFFFFFF");
  assertStrictEquals(expandGroupColor("ffffffeedd"), "FFFFFFEEDD");
  assertStrictEquals(expandGroupColor("AABBCCFF99"), "AABBCCFF99");
});

Deno.test("shorten and expand round-trip for every canonical form", () => {
  const tenDigits: string[] = [
    "AABBCCFF99", // → 5
    "AABBCCFFFF", // → 3
    "FFFFFFFFFF", // → 1
    "123456FFFF", // → 6
    "AABBCCABCD", // → 10
  ];
  for (const input of tenDigits) {
    assertStrictEquals(expandGroupColor(shortenGroupColor(input)), input);
  }
});

Deno.test("both functions throw on invalid input", () => {
  assertThrows(() => shortenGroupColor(""), Error);
  assertThrows(() => shortenGroupColor("ABC"), Error);
  assertThrows(() => shortenGroupColor("AABBCCFF99FF"), Error);
  assertThrows(() => shortenGroupColor("GGGGGGGGGG"), Error);
  assertThrows(() => expandGroupColor(""), Error);
  assertThrows(() => expandGroupColor("12"), Error);
  assertThrows(() => expandGroupColor("1234"), Error);
  assertThrows(() => expandGroupColor("ZZ"), Error);
});
