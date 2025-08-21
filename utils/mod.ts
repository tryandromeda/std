/**
 * No-op function
 *
 * @example
 * ```ts
 * import { noop } from "https://tryandromeda.dev/std/utils/mod.ts";
 * noop(); // does nothing
 * ```
 */
export function noop(): void {}

/**
 * Identity function
 *
 * @example
 * ```ts
 * import { identity } from "https://tryandromeda.dev/std/utils/mod.ts";
 * const n = identity(5); // 5
 * const s = identity('a'); // 'a'
 * ```
 */
export function identity<T>(x: T): T {
  return x;
}

/**
 * Deep clone v1 (JSON-safe)
 *
 * Note: this method uses JSON serialization so it won't preserve functions,
 * Dates, Maps, Sets, or prototype chains.
 *
 * @example
 * ```ts
 * import { clone } from "https://tryandromeda.dev/std/utils/mod.ts";
 * const a = { x: 1, nested: { y: 2 } };
 * const b = clone(a);
 * b.nested.y = 3;
 * console.log(a.nested.y); // 2 (original not modified)
 * ```
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Safe access: returns fallback if access throws or is undefined
 *
 * @example
 * ```ts
 * import { safeGet } from "https://tryandromeda.dev/std/utils/mod.ts";
 * const o = { a: { b: 1 } } as any;
 * // normal access
 * const v1 = safeGet(() => o.a.b, 0); // 1
 * // missing path throws or returns undefined, safeGet returns fallback
 * const v2 = safeGet(() => o.x.y, 42); // 42
 * // accessor that throws
 * const v3 = safeGet(() => { throw new Error('fail'); }, 'fallback'); // 'fallback'
 * ```
 */
export function safeGet<T>(fn: () => T, fallback: T): T {
  try {
    const v = fn();
    return v === undefined ? fallback : v;
  } catch (_e) {
    return fallback;
  }
}
