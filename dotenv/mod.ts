/**
 * Parse and load environment variables from `.env` files, or stringify data
 * into `.env` file format.
 *
 * This module provides a complete implementation for working with `.env` files
 * in Andromeda, supporting advanced features like variable expansion, default
 * values, multi-line strings, and more.
 *
 * Note: Environment variable keys must match the pattern /^[a-zA-Z_][a-zA-Z0-9_]*$/
 *
 * @example Auto-load from .env file
 * ```ts
 * // Simply import to automatically load .env into environment
 * import "https://tryandromeda.dev/std/dotenv/load.ts";
 *
 * console.log(Andromeda.env.get("DATABASE_URL"));
 * ```
 *
 * @example Manual loading
 * ```ts
 * import { load, loadSync } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * // Async load
 * const config = await load();
 * console.log(config.DATABASE_URL);
 *
 * // Sync load
 * const configSync = loadSync();
 * console.log(configSync.DATABASE_URL);
 * ```
 *
 * @example Parsing strings
 * ```ts
 * import { parse } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const envString = `
 *   DATABASE_URL=postgresql://localhost:5432/mydb
 *   REDIS_URL=redis://localhost:6379
 * `;
 * const config = parse(envString);
 * ```
 *
 * @example Stringifying objects
 * ```ts
 * import { stringify } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const config = {
 *   DATABASE_URL: "postgresql://localhost:5432/mydb",
 *   REDIS_URL: "redis://localhost:6379"
 * };
 * const envContent = stringify(config);
 * // Write to file, etc.
 * ```
 *
 * @module
 */

import { parse } from "./parse.ts";
import { stringify } from "./stringify.ts";

// Re-export parse and stringify
export { parse, stringify };

/**
 * Options for configuring how environment variables are loaded.
 */
export interface LoadOptions {
  /**
   * Path to the `.env` file to load. Can be a string path or URL.
   * Set to `null` to skip loading any file.
   *
   * @default {".env"}
   */
  envPath?: string | URL | null;

  /**
   * When `true`, exports all loaded variables to the process environment
   * via `Andromeda.env.set()`. Variables already present in the environment
   * will not be overwritten.
   *
   * @default {false}
   */
  export?: boolean;

  /**
   * Path to an example `.env` file that defines required variables.
   * If specified, will validate that all variables in the example file
   * are present in the loaded configuration.
   *
   * @default {undefined}
   */
  examplePath?: string | URL;
}

/**
 * Synchronously load and parse environment variables from a `.env` file.
 *
 * This function reads the specified `.env` file (or `.env` by default),
 * parses it, and optionally exports the variables to the process environment.
 *
 * Features:
 * - Variable expansion with $VAR or ${VAR}
 * - Default values with ${VAR:-default}
 * - Multi-line values in double quotes
 * - Comment support (# prefix)
 * - Escape sequences (\n, \r, \t)
 * - Export keyword support
 *
 * @example Basic usage
 * ```ts
 * import { loadSync } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const config = loadSync();
 * console.log(config.DATABASE_URL);
 * ```
 *
 * @example With options
 * ```ts
 * import { loadSync } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const config = loadSync({
 *   envPath: ".env.production",
 *   export: true
 * });
 * ```
 *
 * @param options Configuration options for loading
 * @returns Object containing parsed environment variables
 */
export function loadSync(options: LoadOptions = {}): Record<string, string> {
  const { envPath = ".env", export: _export = false, examplePath } = options;

  // Load and parse the main .env file
  const conf = envPath ? parseFileSync(envPath) : {};

  // Optionally validate against example file
  if (examplePath) {
    const example = parseFileSync(examplePath);
    validateConfig(conf, example, examplePath);
  }

  // Export to environment if requested
  if (_export) {
    for (const [key, value] of Object.entries(conf)) {
      // @ts-ignore: Andromeda API
      if (Andromeda.env.get(key) !== undefined) continue;
      // @ts-ignore: Andromeda API
      Andromeda.env.set(key, value);
    }
  }

  return conf;
}

/**
 * Asynchronously load and parse environment variables from a `.env` file.
 *
 * This is the async version of `loadSync()`. It provides the same functionality
 * but uses async file I/O operations.
 *
 * @example Basic usage
 * ```ts
 * import { load } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const config = await load();
 * console.log(config.DATABASE_URL);
 * ```
 *
 * @example With export
 * ```ts
 * import { load } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * await load({ export: true });
 * // Now accessible via Andromeda.env.get()
 * console.log(Andromeda.env.get("DATABASE_URL"));
 * ```
 *
 * @example Custom path
 * ```ts
 * import { load } from "https://tryandromeda.dev/std/dotenv/mod.ts";
 *
 * const config = await load({
 *   envPath: ".env.local",
 *   export: true
 * });
 * ```
 *
 * @param options Configuration options for loading
 * @returns Promise resolving to object containing parsed environment variables
 */
export async function load(
  options: LoadOptions = {},
): Promise<Record<string, string>> {
  const { envPath = ".env", export: _export = false, examplePath } = options;

  // Load and parse the main .env file
  const conf = envPath ? await parseFile(envPath) : {};

  // Optionally validate against example file
  if (examplePath) {
    const example = await parseFile(examplePath);
    validateConfig(conf, example, examplePath);
  }

  // Export to environment if requested
  if (_export) {
    for (const [key, value] of Object.entries(conf)) {
      // @ts-ignore: Andromeda API
      if (Andromeda.env.get(key) !== undefined) continue;
      // @ts-ignore: Andromeda API
      Andromeda.env.set(key, value);
    }
  }

  return conf;
}

/**
 * Synchronously read and parse a .env file
 * @internal
 */
function parseFileSync(filepath: string | URL): Record<string, string> {
  try {
    // @ts-ignore: Andromeda API
    const content = Andromeda.readTextFileSync(filepath);
    return parse(content);
  } catch (e) {
    // Return empty object if file not found
    if (e && typeof e === "object" && "name" in e && e.name === "NotFound") {
      return {};
    }
    throw e;
  }
}

/**
 * Asynchronously read and parse a .env file
 * @internal
 */
async function parseFile(
  filepath: string | URL,
): Promise<Record<string, string>> {
  try {
    // @ts-ignore: Andromeda API
    const content = await Andromeda.readTextFile(filepath);
    return parse(content);
  } catch (e) {
    // Return empty object if file not found
    if (e && typeof e === "object" && "name" in e && e.name === "NotFound") {
      return {};
    }
    throw e;
  }
}

/**
 * Validate that all required variables from example are present in config
 * @internal
 */
function validateConfig(
  config: Record<string, string>,
  example: Record<string, string>,
  examplePath: string | URL,
): void {
  const missing: string[] = [];

  for (const key of Object.keys(example)) {
    if (!(key in config)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[dotenv] Missing required environment variables defined in ${examplePath}: ${missing.join(
        ", ",
      )}`,
    );
  }
}

/**
 * Default export providing all dotenv functionality
 */
export default {
  parse,
  stringify,
  load,
  loadSync,
};
