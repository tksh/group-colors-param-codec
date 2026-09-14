# group-colors-param-codec

A small, standards-agnostic codec for **line-group color parameters**.

A group's `stroke`, `opacity`, and `stroke-opacity` can travel as a single hex
value for URLs, clipboard state, or UI state. This package defines that value
and shortens it to the shortest form that still round-trips.

- Pure and string-level: no DOM, no SVG types, no runtime dependencies.
- Handles **one** group value. Joining several groups with `_` is the caller's
  job.
- Always outputs uppercase; accepts any input casing.
- Throws on invalid input instead of returning sentinel values.

## Format

One group value is five bytes written as ten hex digits:

```text
RR GG BB OO SS
└── stroke ──┘ │  └── stroke-opacity (0x00–0xFF)
               └── opacity (0x00–0xFF)
```

`shortenGroupColor` reduces it to the shortest of the 10 / 6 / 5 / 3 / 1
character forms:

| From | To | Rule                                                  | Example                 |
| ---- | -- | ----------------------------------------------------- | ----------------------- |
| 10   | 6  | both trailing opacities are `FF`                      | `123456FFFF` → …        |
| 10   | 5  | every byte pair repeats                               | `AABBCCFF99` → `ABCF9`  |
| 5    | 3  | both trailing compact opacities are `F`               | `ABCFF` → `ABC`         |
| 3    | 1  | all three compact stroke digits match                 | `AAA` → `A`             |
| 10   | 6  | fallback when only the trailing `FFFF` can be dropped | `123456FFFF` → `123456` |

`expandGroupColor` reverses any of those forms. A 1-digit value repeats six
times; a 3-digit value repeats each digit; omitted opacities come back as `FF`
(fully opaque).

```ts
import {
  expandGroupColor,
  shortenGroupColor,
} from "@tksh/group-colors-param-codec";

shortenGroupColor("AABBCCFFFF"); // "ABC"
shortenGroupColor("000000ffff"); // "0"
shortenGroupColor("AABBCCFF99"); // "ABCF9"
expandGroupColor("ABC"); // "AABBCCFFFF"
expandGroupColor("0"); // "000000FFFF"
```

## Opacity rounding

Opacity is stored as one hex byte, but callers usually work with a normalized
`0..1` float. The conversion rule is fixed so both directions agree:

- **float → hex** (`opacityToHex`): `Math.round(opacity * 255)`; half values
  round up (`0.5` → `0x80`).
- **hex → float** (`hexToOpacity`): rounded to two decimals (`0x99` → `0.6`).

## API

| Function                                | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `shortenGroupColor(value)`              | 10-digit value → shortest 10/6/5/3/1 form            |
| `expandGroupColor(value)`               | shortened value → 10-digit value                     |
| `opacityToHex(opacity)`                 | normalized `0..1` float → 2 hex digits               |
| `hexToOpacity(hex)`                     | 2 hex digits → normalized float (two decimals)       |
| `formatOpacity(opacity)`                | normalized float → `"1.0"` / `"0.0"` / plain decimal |
| `rgbToHex(rgb)`                         | `{ r, g, b }` (0–255) → 6 hex digits                 |
| `hexToRgb(hex)`                         | 3/6-digit hex (optional `#`) → `{ r, g, b }`         |
| `rgbToString(rgb)`                      | `{ r, g, b }` → `"rgb(r g b)"`                       |
| `hexToUint8(hex)` / `uint8ToHex(value)` | 2 hex digits ↔ `0..255` integer                      |
| `expandHexToSix(hex)`                   | 3/6-digit hex → 6 uppercase digits                   |
| `shortenHexAsHalf(hex)`                 | halve a hex value when every byte pair repeats       |
| `removeHash(hex)` / `addHash(hex)`      | drop/add a leading `#`                               |

## Install

Requires [Deno](https://deno.com/).

```sh
deno add jsr:@tksh/group-colors-param-codec
```

## Development

```sh
deno task test && deno task check && deno task lint && deno task fmt
```

## License

[Mozilla Public License Version 2.0](https://www.mozilla.org/en-US/MPL/2.0/)
