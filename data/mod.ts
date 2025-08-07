/**
 * @fileoverview Data manipulation and array utilities
 * @module data
 */

/**
 * Swaps two elements in an array.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4];
 * swap(arr, 0, 3);
 * console.log(arr); // [4, 2, 3, 1]
 * ```
 */
export function swap<T>(array: T[], a: number, b: number): void {
  const temp = array[a];
  array[a] = array[b]!;
  array[b] = temp!;
}

/**
 * Splits an array into chunks of specified size.
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error("Chunk size must be positive");
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Flattens a nested array to a specified depth.
 *
 * @example
 * ```ts
 * flatten([[1, 2], [3, [4, 5]]], 1); // [1, 2, 3, [4, 5]]
 * flatten([[1, 2], [3, [4, 5]]], 2); // [1, 2, 3, 4, 5]
 * ```
 */
export function flatten<T>(array: unknown[], depth = 1): T[] {
  const result: T[] = [];

  function flattenHelper(arr: unknown[], currentDepth: number): void {
    for (const item of arr) {
      if (Array.isArray(item) && currentDepth > 0) {
        flattenHelper(item, currentDepth - 1);
      } else {
        result.push(item as T);
      }
    }
  }

  flattenHelper(array, depth);
  return result;
}

/**
 * Returns unique elements from an array.
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
 * unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Groups array elements by a key function.
 *
 * @example
 * ```ts
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Carol', age: 25 }
 * ];
 * groupBy(people, p => p.age);
 * // Map(2) { 25 => [Alice, Carol], 30 => [Bob] }
 * ```
 */
export function groupBy<T, K>(array: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of array) {
    const key = keyFn(item);
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}

/**
 * Sorts array by a key function.
 *
 * @example
 * ```ts
 * const people = [
 *   { name: 'Carol', age: 25 },
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 20 }
 * ];
 * sortBy(people, p => p.age); // [Bob(20), Carol(25), Alice(30)]
 * sortBy(people, p => p.name); // [Alice, Bob, Carol]
 * ```
 */
export function sortBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  return [...array].sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
}

/**
 * Removes element at specified index and returns it.
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4];
 * const removed = removeAt(arr, 1); // removed = 2, arr = [1, 3, 4]
 * ```
 */
export function removeAt<T>(array: T[], index: number): T | undefined {
  if (index < 0 || index >= array.length) return undefined;
  return array.splice(index, 1)[0];
}

/**
 * Inserts element at specified index.
 *
 * @example
 * ```ts
 * const arr = [1, 3, 4];
 * insertAt(arr, 1, 2); // arr = [1, 2, 3, 4]
 * ```
 */
export function insertAt<T>(array: T[], index: number, item: T): void {
  array.splice(index, 0, item);
}

/**
 * Rotates array elements to the left by n positions.
 *
 * @example
 * ```ts
 * rotateLeft([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
 * ```
 */
export function rotateLeft<T>(array: T[], n: number): T[] {
  const len = array.length;
  if (len === 0) return array;
  n = n % len;
  if (n === 0) return [...array];
  return [...array.slice(n), ...array.slice(0, n)];
}

/**
 * Rotates array elements to the right by n positions.
 *
 * @example
 * ```ts
 * rotateRight([1, 2, 3, 4, 5], 2); // [4, 5, 1, 2, 3]
 * ```
 */
export function rotateRight<T>(array: T[], n: number): T[] {
  const len = array.length;
  if (len === 0) return array;
  n = n % len;
  if (n === 0) return [...array];
  return [...array.slice(-n), ...array.slice(0, -n)];
}

/**
 * Performs binary search on a sorted array.
 *
 * @example
 * ```ts
 * binarySearch([1, 3, 5, 7, 9], 5); // 2
 * binarySearch([1, 3, 5, 7, 9], 6); // -1
 * ```
 */
export function binarySearch<T>(
  array: T[],
  target: T,
  compareFn?: (a: T, b: T) => number,
): number {
  const compare = compareFn || ((a, b) => a < b ? -1 : a > b ? 1 : 0);
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = compare(array[mid]!, target);

    if (comparison === 0) return mid;
    if (comparison < 0) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

/**
 * Partitions array into two arrays based on predicate.
 *
 * @example
 * ```ts
 * const [evens, odds] = partition([1, 2, 3, 4, 5], x => x % 2 === 0);
 * // evens = [2, 4], odds = [1, 3, 5]
 * ```
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }

  return [truthy, falsy];
}

/**
 * Finds the intersection of multiple arrays.
 *
 * @example
 * ```ts
 * intersect([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [3]
 * ```
 */
export function intersect<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return unique(arrays[0]!);

  const sets = arrays.map(arr => new Set(arr));
  const [first, ...rest] = sets;

  return Array.from(first!).filter(item => rest.every(set => set.has(item)));
}

/**
 * Finds the difference between arrays (elements in first array but not in others).
 *
 * @example
 * ```ts
 * difference([1, 2, 3, 4], [2, 3], [3, 4]); // [1]
 * ```
 */
export function difference<T>(array: T[], ...others: T[][]): T[] {
  const othersSet = new Set(others.flat());
  return array.filter(item => !othersSet.has(item));
}

/**
 * Performs a deep equality check between two values.
 *
 * @example
 * ```ts
 * deepEqual([1, [2, 3]], [1, [2, 3]]); // true
 * deepEqual({a: {b: 1}}, {a: {b: 1}}); // true
 * ```
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (
      !deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    ) return false;
  }

  return true;
}
