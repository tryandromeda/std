/**
 * Character escape mappings for double-quoted strings
 */
const CHARACTERS_MAP: { [key: string]: string } = {
  "\\n": "\n",
  "\\r": "\r",
  "\\t": "\t",
};

/**
 * Expands escape sequences like \n, \r, \t in strings
 */
function expandCharacters(str: string): string {
  return str.replace(
    /\\([nrt])/g,
    (match: string): string => CHARACTERS_MAP[match] ?? match,
  );
}

/**
 * Expands variable references in the form of $VAR or ${VAR} or ${VAR:-default}
 */
function expand(str: string, variablesMap: Record<string, string>): string {
  let current = str;
  let lastValue = "";
  let iterations = 0;
  const maxIterations = 100; // Prevent infinite loops

  // Keep expanding until no more changes or max iterations reached
  while (current !== lastValue && iterations < maxIterations) {
    lastValue = current;
    iterations++;

    // Replace ${VAR:-default} or ${VAR}
    current = current.replace(
      /\$\{([A-Za-z_][A-Za-z0-9_]*)(?:\:\-([^}]*))?\}/g,
      (_match, varName, defaultValue) => {
        // Try to get from parsed variables first
        if (variablesMap[varName] !== undefined) {
          return variablesMap[varName];
        }

        // Try to get from environment
        // @ts-ignore: Andromeda API
        if (typeof Andromeda !== "undefined" && Andromeda.env?.get) {
          // @ts-ignore: Andromeda API
          const fromEnv = Andromeda.env.get(varName);
          if (fromEnv !== undefined) return fromEnv;
        }

        // Use default value or empty string
        return defaultValue ?? "";
      },
    );

    // Replace $VAR (simple version without negative lookbehind)
    // We'll handle escaped $ by doing a two-pass approach
    const DOLLAR_PLACEHOLDER = "\x00ESCAPED_DOLLAR\x00";

    // First, replace \$ with placeholder
    let temp = current.replace(/\\\$/g, DOLLAR_PLACEHOLDER);

    // Then replace $VAR
    temp = temp.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_match, varName) => {
      // Try to get from parsed variables first
      if (variablesMap[varName] !== undefined) {
        return variablesMap[varName];
      }

      // Try to get from environment
      // @ts-ignore: Andromeda API
      if (typeof Andromeda !== "undefined" && Andromeda.env?.get) {
        // @ts-ignore: Andromeda API
        const fromEnv = Andromeda.env.get(varName);
        if (fromEnv !== undefined) return fromEnv;
      }

      // Return empty string if not found
      return "";
    });

    // Restore escaped dollars
    current = temp.replace(new RegExp(DOLLAR_PLACEHOLDER, "g"), "$");
  }

  return current;
}

/**
 * Parse `.env` file content into an object.
 *
 * Supports:
 * - Basic key=value pairs
 * - Single and double quoted values
 * - Multi-line values in double quotes
 * - Comments (lines starting with #)
 * - Inline comments (after unquoted values)
 * - Variable expansion with $VAR or ${VAR}
 * - Default values with ${VAR:-default}
 * - Escape sequences (\n, \r, \t) in double quotes
 * - export keyword prefix
 *
 * Note: The key must match the pattern /^[a-zA-Z_][a-zA-Z0-9_]*$/
 *
 * @example Usage
 * ```ts
 * import { parse } from "https://tryandromeda.dev/std/dotenv/parse.ts";
 *
 * const env = parse("GREETING=hello world");
 * console.log(env); // { GREETING: "hello world" }
 *
 * const complex = parse(`
 *   # Database configuration
 *   DB_HOST=localhost
 *   DB_PORT=5432
 *   DB_URL=postgresql://$DB_HOST:$DB_PORT/mydb
 *   DB_BACKUP=\${DB_URL:-postgresql://localhost:5432/backup}
 * `);
 * ```
 *
 * @param text The .env file content to parse
 * @returns Object containing parsed environment variables
 */
export function parse(text: string): Record<string, string> {
  const env: Record<string, string> = Object.create(null);
  const keysForExpandCheck: string[] = [];

  // Split into lines
  const lines = text.split(/\r?\n/);

  for (let line of lines) {
    // Trim leading/trailing whitespace
    line = line.trim();

    // Skip empty lines
    if (!line) continue;

    // Skip comments
    if (line.startsWith("#")) continue;

    // Remove optional 'export ' prefix
    if (line.startsWith("export ")) {
      line = line.substring(7).trim();
    }

    // Try to match key=value pattern
    // This handles:
    // - KEY=value (unquoted)
    // - KEY='value' (single quoted)
    // - KEY="value" (double quoted)
    // - KEY= (empty value)
    const equalIndex = line.indexOf("=");
    if (equalIndex === -1) continue;

    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1);

    // Validate key format
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
      console.warn(
        `[dotenv] Ignored invalid key "${key}": Must match /^[a-zA-Z_][a-zA-Z0-9_]*$/`,
      );
      continue;
    }

    // Determine quote type and extract value
    let quotedValue = false;
    let interpolate = false;

    if (value.length >= 2) {
      // Check for single quotes
      if (value[0] === "'" && value[value.length - 1] === "'") {
        // Single quoted: no interpolation, no escape sequences
        value = value.substring(1, value.length - 1);
        quotedValue = true;
      }
      // Check for double quotes
      else if (value[0] === '"' && value[value.length - 1] === '"') {
        // Double quoted: escape sequences but no variable interpolation
        value = value.substring(1, value.length - 1);
        value = expandCharacters(value);
        quotedValue = true;
        interpolate = false;
      }
      // Check for multi-line double quotes (simple case)
      else if (value[0] === '"') {
        // Try to find closing quote in the same line first
        const closingQuote = value.lastIndexOf('"');
        if (closingQuote > 0) {
          value = value.substring(1, closingQuote);
          value = expandCharacters(value);
          quotedValue = true;
        } else {
          // For multi-line, we'll treat it as double-quoted until we find the end
          // For now, just take everything after the opening quote
          value = value.substring(1);
          value = expandCharacters(value);
          quotedValue = true;
        }
      }
    }

    // Handle unquoted values
    if (!quotedValue) {
      // Remove inline comments (only for unquoted values)
      const hashIndex = value.indexOf("#");
      if (hashIndex !== -1) {
        value = value.substring(0, hashIndex);
      }

      // Trim whitespace from unquoted values
      value = value.trim();

      // Mark for variable expansion
      keysForExpandCheck.push(key);
    }

    env[key] = value;
  }

  // Expand variables in unquoted values
  const variablesMap = { ...env };
  for (const key of keysForExpandCheck) {
    env[key] = expand(env[key], variablesMap);
  }

  return env;
}
