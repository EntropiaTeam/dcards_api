/**
 * @return `true` for 1XX-4XX status codes and `false` for 5XX codes
 * or not existing ranges of codes (e.g. 50 or 600)
 */
export function isNotServerErrorStatusCode(statusCode: number): boolean {
  return statusCode >= 100 && statusCode <= 499;
}
