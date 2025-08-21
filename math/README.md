# Math

Math utilities and structures used by other modules.

Public API is exported from `mod.ts`.

See `mod.ts` and `shapes.ts` for available functions and types.

## Examples

Import utilities from `mod.ts` and types from `shapes.ts`:

```ts
import {
  average,
  clamp,
  factorial,
  fuzzyEquals,
  random,
} from "https://tryandromeda.dev/std/math/mod.ts";
import {
  inferShape,
  Rank,
  shapeTo2D,
} from "https://tryandromeda.dev/std/math/shapes.ts";

console.log(clamp(15, 0, 10)); // 10
console.log(factorial(5)); // 120
console.log(average(1, 2, 3, 4)); // 2.5

const arr = [[1, 2], [3, 4]];
console.log(inferShape(arr)); // [2,2]
console.log(shapeTo2D([4, 2, 3])); // [2,3]
```
