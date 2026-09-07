export type ComparisonPair = [string | null, string | null];

/** Preserve empty slots and reject unknown or repeated IDs from shared links. */
export function resolveComparison(raw: string | null, defaults: ComparisonPair, validIds: ReadonlySet<string>): ComparisonPair {
  if (raw === null) return [...defaults];
  const parts = raw.split(",", 2).map((id) => id.trim());
  const first = validIds.has(parts[0]) ? parts[0] : null;
  const second = validIds.has(parts[1]) && parts[1] !== first ? parts[1] : null;
  return [first, second];
}

export function comparisonQuery(pair: ComparisonPair): string {
  return pair.map((id) => id ?? "").join(",");
}

/** Compare at the same whole-dollar precision used by the displayed estimates. */
export function comparisonWinner(values: [number | null, number | null]): 0 | 1 | "tie" | null {
  const [first, second] = values;
  if (first === null || second === null) return null;
  const a = Math.round(first);
  const b = Math.round(second);
  return a === b ? "tie" : a > b ? 0 : 1;
}
