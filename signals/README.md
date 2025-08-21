# Signals

Signal library utilities and helpers.

Public API is exported from `mod.ts`.

See `mod.ts` for available signals and helpers.

## Examples

Basic signals and computed values:

```ts
import {
  batch,
  createComputed,
  createDebounced,
  createEffect,
  createSignal,
} from "https://tryandromeda.dev/std/collections/mod.ts";

const count = createSignal(0);
const doubled = createComputed(() => count.value * 2);

createEffect(() => {
  console.log("count:", count.value, "doubled:", doubled.value);
});

count.setValue(1); // effect runs and logs updated values

batch(() => {
  count.setValue(2);
  count.setValue(3);
}); // effects/dependents update once after the batch

// Debounced signal example
const src = createSignal("");
const deb = createDebounced(src, 200);
src.setValue("hello");
// deb.value will update after 200ms
```
