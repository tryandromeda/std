/**
 * @fileoverview Andromeda Standard Library
 * @description A focused, type-safe standard library for the Andromeda TypeScript/JavaScript runtime
 * @version 1.0.0
 * @license MPL-2.0
 */

// Re-export working modules
export * as collections from "./collections/mod.ts";
export * as data from "./data/mod.ts";
export * as math from "./math/mod.ts";
export * as signals from "./signals/mod.ts";

// Export commonly used functions directly for convenience
export {
  average,
  bezier,
  // Math
  clamp,
  factorial,
  fuzzyEquals,
  random,
} from "./math/mod.ts";

export {
  chunk,
  flatten,
  groupBy,
  sortBy,
  // Data
  swap,
  unique,
} from "./data/mod.ts";

export {
  batch,
  createComputed,
  createEffect,
  // Signals
  createSignal,
} from "./signals/mod.ts";

export {
  BinaryTree,
  Heap,
  LinkedList,
  // Collections
  Queue,
  Stack,
} from "./collections/mod.ts";

/**
 * Standard library version
 */
export const VERSION = "1.0.0";

/**
 * Runtime information
 */
export const RUNTIME = {
  name: "andromeda",
  version: "1.0.0",
  platform: typeof globalThis !== "undefined" ? "andromeda" : "unknown",
} as const;
