/**
 * @param baseValue Float value
 * @param subtractedValue Float value
 * @returns Value with precision 2
 */
export function getFixedDiff(baseValue: number, subtractedValue: number, precision = 2): number {
  return +(baseValue - subtractedValue).toFixed(precision);
}
