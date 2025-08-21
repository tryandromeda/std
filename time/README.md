# Time

Time utilities and helpers used across Andromeda projects.

Public API is exported from `mod.ts`.

## Examples

```ts
import { formatMs, sleep, toMilliseconds } from "https://tryandromeda.dev/std/time/mod.ts";

console.log(formatMs(3661007)); // "01:01:01.007"

await sleep(10);

console.log(toMilliseconds({ hours: 1, minutes: 30 })); // 5400000
```
