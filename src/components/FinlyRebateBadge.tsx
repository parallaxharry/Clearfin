import { FINLY_REBATES_CHECKED_AT, getFinlyRebate } from "@/lib/finlyRebates";

interface FinlyRebateBadgeProps {
  cardId: string;
  applicationUrl: string | null | undefined;
  className?: string;
}

export default function FinlyRebateBadge({
  cardId,
  applicationUrl,
  className = "",
}: FinlyRebateBadgeProps) {
  const rebate = getFinlyRebate(cardId, applicationUrl);
  if (!rebate) return null;

  return (
    <span
      className={`finly-rebate-badge${rebate.isPromotional ? " is-promotional" : ""}${className ? ` ${className}` : ""}`}
      title={`FinlyWealth cash rebate for an eligible approved application. Terms apply. Amount checked ${FINLY_REBATES_CHECKED_AT}.`}
    >
      <small>{rebate.isPromotional ? "Limited-time rebate" : "Exclusive cash rebate"}</small>
      <strong>+${rebate.amount}</strong>
      <em>Apply through ClearFin*</em>
    </span>
  );
}
