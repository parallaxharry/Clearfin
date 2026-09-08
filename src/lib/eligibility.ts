// Catalogue checks are guidance, never an issuer approval decision.
export interface IncomeRequirements {
  minIncome: number | null;
  minIncomeHousehold: number | null;
  creditMin: number | null; // An estimated range, not a published approval cutoff.
}

export function nonNegativeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

export function checkIncome(requirements: IncomeRequirements | undefined, personal: number, household: number | null) {
  const p = nonNegativeNumber(requirements?.minIncome);
  const h = nonNegativeNumber(requirements?.minIncomeHousehold);
  const personalValue = nonNegativeNumber(personal);
  const householdValue = nonNegativeNumber(household);
  if (p !== null && personalValue !== null && personalValue >= p) {
    return { state: "matched" as const, label: "Recorded personal-income check met" };
  }
  if (h !== null && householdValue !== null && householdValue >= h && personalValue !== null && householdValue >= personalValue) {
    return { state: "matched" as const, label: "Recorded household-income check met" };
  }
  // Null never means no requirement. A missing alternative or omitted household
  // answer cannot prove either satisfaction or failure of all recorded routes.
  if (p === null || h === null || personalValue === null || householdValue === null || householdValue < personalValue) {
    return { state: "unknown" as const, label: "Income requirements need checking" };
  }
  return { state: "below" as const, label: "Below the recorded income thresholds" };
}

export function creditGuidance(requirements: IncomeRequirements | undefined, credit: number) {
  const minimum = nonNegativeNumber(requirements?.creditMin);
  if (minimum === null || minimum < 300 || minimum > 900) return "Credit-score guidance unavailable";
  return credit < minimum ? "Below the estimated credit-score range — check with issuer" : "Within the estimated credit-score range — not an approval guarantee";
}
