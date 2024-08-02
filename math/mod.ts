/**
 * Clamps a value between a minimum and maximum value.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10); // 5
 * clamp(-5, 0, 10); // 0
 * clamp(15, 0, 10); // 10
 * ```
 */
export const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

/**
 * Factorial of a number.
 *
 * @example
 * ```ts
 * factorial(5); // 120
 * ```
 */
export const factorial = (n: number): number =>
    n === 0 ? 1 : n * factorial(n - 1);

/**
 * Generates a random number between the specified range.
 * If no range is specified, the default range is [0, 1].
 */
export const random = (min = 0, max = 1): number =>
    Math.random() * (max - min) + min;

/**
 * Average of numbers.
 *
 * @example
 * ```ts
 * average(1, 2, 3, 4, 5); // 3
 * ```
 */
export const average = (...numbers: number[]): number =>
    numbers.reduce((acc, val) => acc + val, 0) / numbers.length;

/**
 * Bezier curve.
 * @example
 * ```ts
 * bezier(0.1, 0.2, 0.3, 0.4, 0.5); // 0.2375
 * ```
 * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo
 */
export const bezier = (
    t: number,
    p0: number,
    p1: number,
    p2: number,
    p3: number,
): number =>
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3;

/**
 * FuzzyEquals is a function that compares two numbers and returns true if they are approximately equal.
 *
 * @example
 * ```ts
 * fuzzyEquals(0.1 + 0.2, 0.3); // true
 * ```
 */
export const fuzzyEquals = (a: number, b: number, epsilon = 0.0001) =>
    Math.abs(a - b) < epsilon;
