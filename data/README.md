# Data

Utilities for data manipulation and processing.

This package exposes its public API through `mod.ts`.

See `mod.ts` for available utilities and examples.

## Examples

Import specific utilities from the module:

```ts
import {
  binarySearch,
  chunk,
  flatten,
  unique,
} from "https://tryandromeda.dev/std/data/mod.ts";

const vals = [1, 2, 2, 3, 4, 5];
console.log(unique(vals)); // [1, 2, 3, 4, 5]

console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1,2],[3,4],[5]]

console.log(flatten([[1, [2]], [3]], 2)); // [1, 2, 3]

console.log(binarySearch([1, 3, 5, 7], 5)); // 2
```
