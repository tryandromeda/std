# Utils

Small general-purpose utilities used across Andromeda projects.

Public API is exported from `mod.ts`.

## Examples

```ts
import { noop, identity, clone, safeGet } from "https://tryandromeda.dev/std/utils/mod.ts";

noop();
console.log(identity(5)); // 5
console.log(clone({ a: 1 })); // { a: 1 }
console.log(safeGet(() => JSON.parse("invalid"), { ok: false })); // { ok: false }
```
