# dotenv

Load environment variables from `.env` files for Andromeda applications.

This module provides a complete implementation for working with `.env` files,
supporting advanced features like variable expansion, default values, multi-line
strings, and more. The dotenv module is based off of the deno dotenv module see https://jsr.io/@std/dotenv

## Usage

### Auto-load from .env file

The simplest way to use dotenv is to import the `load.ts` module, which
automatically loads variables from `.env` into the process environment:

```ts
// At the top of your main application file
import "https://tryandromeda.dev/std/dotenv/load.ts";

// Now you can access variables from .env
console.log(Andromeda.env.get("DATABASE_URL"));
console.log(Andromeda.env.get("API_KEY"));
```

With a `.env` file like:

```sh
# Database Configuration
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=secret123
PORT=3000
```

### Manual loading

For more control, use the `load()` or `loadSync()` functions:

```ts
import { load, loadSync } from "https://tryandromeda.dev/std/dotenv/mod.ts";

// Async loading
const config = await load();
console.log(config.DATABASE_URL);

// Sync loading
const configSync = loadSync();
console.log(configSync.DATABASE_URL);

// Export to environment
await load({ export: true });
console.log(Andromeda.env.get("DATABASE_URL"));
```

### Custom .env file paths

```ts
import { load } from "https://tryandromeda.dev/std/dotenv/mod.ts";

// Load from a custom path
const prodConfig = await load({
  envPath: ".env.production",
  export: true,
});

// Load multiple environments
const devConfig = await load({ envPath: ".env.development" });
const localConfig = await load({ envPath: ".env.local" });

// Merge configurations
const config = { ...devConfig, ...localConfig };
```

### Parse .env strings

```ts
import { parse } from "https://tryandromeda.dev/std/dotenv/mod.ts";

const envString = `
  DATABASE_URL=postgresql://localhost:5432/mydb
  REDIS_URL=redis://localhost:6379
  # This is a comment
  APP_NAME="My Application"
`;

const config = parse(envString);
console.log(config);
// {
//   DATABASE_URL: "postgresql://localhost:5432/mydb",
//   REDIS_URL: "redis://localhost:6379",
//   APP_NAME: "My Application"
// }
```

### Stringify objects to .env format

```ts
import { stringify } from "https://tryandromeda.dev/std/dotenv/mod.ts";

const config = {
  DATABASE_URL: "postgresql://localhost:5432/mydb",
  API_KEY: "secret123",
  MESSAGE: "Hello\nWorld",
};

const envContent = stringify(config);
console.log(envContent);
// DATABASE_URL='postgresql://localhost:5432/mydb'
// API_KEY=secret123
// MESSAGE="Hello\nWorld"

// Write to file
await Andromeda.writeTextFile(".env.backup", envContent);
```

### Validate against example file

```ts
import { loadSync } from "https://tryandromeda.dev/std/dotenv/mod.ts";

// This will throw an error if required variables are missing
const config = loadSync({
  envPath: ".env",
  examplePath: ".env.example",
  export: true,
});
```

## .env File Format

### Basic syntax

```sh
# Comments start with #
KEY=value
QUOTED='single quoted value'
DOUBLE_QUOTED="double quoted value"

# Export prefix is supported
export EXPORTED_VAR=value
```

### Variable expansion

Variables can reference other variables or environment variables:

```sh
HOST=localhost
PORT=5432
DATABASE=mydb

# Reference other variables
DATABASE_URL=postgresql://$HOST:$PORT/$DATABASE
# Or with braces
DATABASE_URL=postgresql://${HOST}:${PORT}/${DATABASE}

# Use default values if variable doesn't exist
BACKUP_URL=${BACKUP_HOST:-localhost}/backup
LOG_LEVEL=${LOG_LEVEL:-info}
```

### Multi-line values

Use double quotes for multi-line values:

```sh
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7
-----END PRIVATE KEY-----"

MESSAGE="Hello
World
From
Multiple
Lines"
```

### Escape sequences

Double-quoted values support escape sequences:

```sh
NEWLINE="Line 1\nLine 2\nLine 3"
TAB="Column1\tColumn2\tColumn3"
RETURN="Carriage\rReturn"
QUOTE="He said \"Hello\""
```

### Special characters

```sh
# Simple values don't need quotes
SIMPLE_VALUE=123
ALPHANUMERIC=abc123

# Values with special characters should be quoted
SPECIAL='value with spaces'
URL='https://example.com?foo=bar&baz=qux'
JSON='{"key": "value", "nested": {"foo": "bar"}}'
```
