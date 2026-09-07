/** Estimated rewards use whole dollars; fees retain cents when present. */
export function formatEstimate(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-CA");
}

export function formatCost(value: number): string {
  return "$" + value.toLocaleString("en-CA", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
