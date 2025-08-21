/** Parse .env file content into an object */
export function parse(src: string): Record<string, string> {
    const obj: Record<string, string> = {};

    const lineRE = /^(?:\s*)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?$/;
    const lines = src.split(/\r?\n/);

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.startsWith("#")) continue;

        const match = line.match(lineRE);
        if (!match) continue;

        const key = match[1];
        let val = match[2] ?? "";

        // Remove inline comments (only if not quoted)
        if (val.includes("#")) {
            const quot = val[0];
            if (quot !== '"' && quot !== "'") {
                val = val.split("#")[0].trim();
            }
        }

        // Unquote
        if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
        ) {
            val = val.substring(1, val.length - 1);
            // handle escaped newlines and quotes for double-quoted
            if (val.includes("\\") && val.includes("n")) {
                val = val.replace(/\\n/g, "\n");
            }
            val = val.replace(/\\"/g, '"').replace(/\\'/g, "'");
        } else {
            val = val.trim();
        }

        obj[key] = val;
    }

    return obj;
}

/** Expand ${VAR} references using provided variables (defaults to the same object) */
export function expand(
    obj: Record<string, string>,
    env: Record<string, string> = obj,
): Record<string, string> {
    const out: Record<string, string> = { ...obj };
    const varRE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

    for (const k of Object.keys(out)) {
        const v = out[k];
        out[k] = v.replace(varRE, (_m, name) => env[name] ?? "");
    }

    return out;
}

/** Load .env file asynchronously and return parsed variables */
export async function load(path = ".env") {
    // @ts-ignore: dynamic invocation
    const content = await Andromeda.readTextFile(path);
    const parsed = expand(parse(content));
    for (const [k, v] of Object.entries(parsed)) {
        // @ts-ignore: dynamic invocation
        Andromeda.env.set(
            k,
            v,
        );
    }
    return parsed;
}

/** Load .env file synchronously and return parsed variables */
export function loadSync(path = ".env") {
    // @ts-ignore: dynamic invocation
    const content = Andromeda.readTextFileSync(path);
    const parsed = expand(parse(content));

    for (const [k, v] of Object.entries(parsed)) {
        // @ts-ignore: dynamic invocation
        Andromeda.env.set(k, v);
    }

    return parsed;
}

export default { parse, expand, load, loadSync };
