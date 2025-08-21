# dotenv

Lightweight .env parser and loader compatible with Deno and Node.

Basic API:

- `parse(src: string): Record<string,string>` - parse .env content
- `expand(obj, env?)` - expand ${VAR} references
- `load(path?)` - async load and parse .env
- `loadSync(path?)` - sync load and parse .env

Example:

```ts
import dotenv from "https://tryandromeda.dev/std/dotenv/mod.ts";

const vars = dotenv.parse("FOO=bar\nBAZ=qux");
console.log(vars.FOO); // 'bar'
```

load and parse .env

.env file

```text

FOO=bar
```

```ts

import "https://tryandromeda.dev/std/dotenv/load.ts";

console.log(Andromeda.env.get("FOO")) // 'bar'
```
