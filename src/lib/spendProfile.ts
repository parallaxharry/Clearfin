import { DEFAULT_SPEND, type SpendKey } from "./cards";

export interface SpendProfile {
  spend: Record<SpendKey, number>;
  income: number;
  credit: number;
}

export function createDefaultProfile(): SpendProfile {
  return { spend: { ...DEFAULT_SPEND }, income: 60000, credit: 720 };
}

type ProfileAction =
  | { type: "spend"; value: Record<SpendKey, number> }
  | { type: "income" | "credit"; value: number }
  | { type: "reset" };

export function spendProfileReducer(profile: SpendProfile, action: ProfileAction): SpendProfile {
  switch (action.type) {
    case "spend": return { ...profile, spend: { ...action.value } };
    case "income": return { ...profile, income: action.value };
    case "credit": return { ...profile, credit: action.value };
    case "reset": return createDefaultProfile();
  }
}
