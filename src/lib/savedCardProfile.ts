import { REWARD_MODEL_VERSION } from "./rewardModel";

import type { SpendKey } from "@/lib/cards";

export interface SavedCardResult {
  id: string;
  netValue: number;
}

export interface SavedCardProfile {
  version: 1;
  rewardModelVersion?: string;
  spend: Record<SpendKey, number>;
  personalIncome: number;
  householdIncome: number;
  results: SavedCardResult[];
  savedAt: string;
}

const STORAGE_KEY = "clearfin:card-profile:v1";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const SPEND_KEYS: SpendKey[] = ["dining", "grocery", "gas", "travel", "other"];

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidProfile(value: unknown): value is SavedCardProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<SavedCardProfile>;
  if (profile.version !== 1 || !profile.spend || typeof profile.spend !== "object") return false;
  if (!isFiniteNonNegative(profile.personalIncome) || !isFiniteNonNegative(profile.householdIncome)) return false;
  if (!SPEND_KEYS.every((key) => isFiniteNonNegative(profile.spend?.[key]))) return false;
  if (!Array.isArray(profile.results)) return false;
  if (!profile.results.every((result) => (
    Boolean(result) &&
    typeof result.id === "string" &&
    result.id.length > 0 &&
    typeof result.netValue === "number" &&
    Number.isFinite(result.netValue)
  ))) return false;
  if (typeof profile.savedAt !== "string" || !Number.isFinite(Date.parse(profile.savedAt))) return false;
  return true;
}

export function loadCardProfile(): SavedCardProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProfile(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const age = Date.now() - Date.parse(parsed.savedAt);
    if (age < 0 || age > MAX_AGE_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Preserve inputs, but never show rankings produced by an older math model.
    return parsed.rewardModelVersion === REWARD_MODEL_VERSION
      ? parsed
      : { ...parsed, results: [] };
  } catch {
    return null;
  }
}

export function saveCardProfile(profile: SavedCardProfile): void {
  if (typeof window === "undefined" || !isValidProfile(profile)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage may be unavailable in private/restricted browser contexts.
  }
}

export function clearCardProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable in private/restricted browser contexts.
  }
}
