/**
 * Auto-load environment variables from `.env` file into the process environment.
 *
 * Simply import this module to automatically load and export all variables
 * from the `.env` file in the current directory into `Andromeda.env`.
 *
 * This is equivalent to calling `loadSync({ export: true })`.
 *
 * @example Usage
 * ```ts
 * // At the top of your main application file
 * import "https://tryandromeda.dev/std/dotenv/load.ts";
 *
 * // Now you can access variables from .env
 * console.log(Andromeda.env.get("DATABASE_URL"));
 * console.log(Andromeda.env.get("API_KEY"));
 * ```
 *
 * @example With .env file
 * ```sh
 * # .env
 * DATABASE_URL=postgresql://localhost:5432/mydb
 * API_KEY=secret123
 * PORT=3000
 * ```
 *
 * @module
 */

import { loadSync } from "./mod.ts";

// Check if readTextFileSync is available before attempting to load
// @ts-ignore: Andromeda API
if (typeof Andromeda !== "undefined" && Andromeda.readTextFileSync) {
  loadSync({ export: true });
} else {
  console.warn(
    "[dotenv] Andromeda.readTextFileSync is not available: No .env data was loaded.",
  );
}
