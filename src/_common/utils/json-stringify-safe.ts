/**
 * Similar to JSON.stringify(), but doesn't throw any error. Return error string instead.
 */
export function jsonStringifySafe(data: unknown, space: string | number = 2): string {
  try {
    return JSON.stringify(data, null, space);
  } catch (err) {
    return `Error during stringifying: ${(err as Record<string, string>)?.message}`;
  }
}
