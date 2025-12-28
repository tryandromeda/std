/**
 * Stringify an object into valid `.env` file format.
 *
 * Values containing special characters will be automatically quoted.
 * Single quotes are used for simple values, double quotes for values
 * containing newlines or single quotes.
 *
 * @example Basic usage
 * ```ts
 * import { stringify } from "https://tryandromeda.dev/std/dotenv/stringify.ts";
 *
 * const env = { GREETING: "hello world", PORT: "3000" };
 * console.log(stringify(env));
 * // GREETING='hello world'
 * // PORT=3000
 * ```
 *
 * @example Complex values
 * ```ts
 * import { stringify } from "https://tryandromeda.dev/std/dotenv/stringify.ts";
 *
 * const env = {
 *   MESSAGE: "Hello\nWorld",
 *   QUOTE: "It's working",
 *   SIMPLE: "value"
 * };
 * console.log(stringify(env));
 * // MESSAGE="Hello\nWorld"
 * // QUOTE="It's working"
 * // SIMPLE=value
 * ```
 *
 * @param object Object to stringify into .env format
 * @returns String in .env file format
 */
export function stringify(object: Record<string, string>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(object)) {
    // Skip keys that start with # (treated as comments)
    if (key.startsWith("#")) {
      console.warn(
        `[dotenv] Key "${key}" starts with '#' (indicates comment) and was ignored`,
      );
      continue;
    }

    let quote;
    let escapedValue = value ?? "";

    // Determine quoting strategy based on content
    if (escapedValue.includes("\n") || escapedValue.includes("'")) {
      // Use double quotes for newlines or single quotes in value
      escapedValue = escapedValue.replaceAll("\n", "\\n");
      quote = `"`;
    } else if (escapedValue.match(/\W/)) {
      // Use single quotes for values with special characters
      quote = "'";
    }

    if (quote) {
      // Escape inner quotes to prevent syntax errors
      escapedValue = escapedValue.replaceAll(quote, `\\${quote}`);
      escapedValue = `${quote}${escapedValue}${quote}`;
    }

    const line = `${key}=${escapedValue}`;
    lines.push(line);
  }

  return lines.join("\n");
}
