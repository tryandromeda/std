/**
 * Format milliseconds to human-readable time (HH:MM:SS.mmm)
 * @example
 * ```ts
 * import { formatMs } from "https://tryandromeda.dev/std/time/mod.ts";
 * console.log(formatMs(3661007)); // "01:01:01.007"
 * console.log(formatMs(61007)); // "01:01.007"
 * ```
 */
export function formatMs(ms: number): string {
  const sign = ms < 0 ? "-" : "";
  ms = Math.abs(ms);
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  const parts = [] as string[];
  if (hours) parts.push(String(hours).padStart(2, "0"));
  parts.push(String(minutes).padStart(2, "0"));
  parts.push(String(seconds).padStart(2, "0"));
  return `${sign}${parts.join(":")}.${String(millis).padStart(3, "0")}`;
}

/**
 * Convert a duration object to milliseconds
 * @example
 * ```ts
 * import { toMilliseconds } from "https://tryandromeda.dev/std/time/mod.ts";
 * console.log(toMilliseconds({ hours: 1, minutes: 30 })); // 5400000
 * console.log(toMilliseconds({ seconds: 1, ms: 250 })); // 1250
 * ```
 */
export function toMilliseconds(
  duration: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    ms?: number;
  },
): number {
  const d = duration;
  return (d.days || 0) * 86400000 + (d.hours || 0) * 3600000 +
    (d.minutes || 0) * 60000 + (d.seconds || 0) * 1000 + (d.ms || 0);
}
