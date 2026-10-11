"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FinlyRebateBadge from "@/components/FinlyRebateBadge";
import type { CatalogListCard } from "@/lib/cardDetail";
import {
  clearCardProfile,
  loadCardProfile,
  type SavedCardProfile,
} from "@/lib/savedCardProfile";
import styles from "./PersonalizedCatalog.module.css";

interface PersonalizedCatalogProps {
  cards: CatalogListCard[];
}

type SortMode = "best" | "catalogue";

function formatNetValue(value: number): string {
  const rounded = Math.round(Math.abs(value));
  return `${value < 0 ? "-" : ""}$${rounded.toLocaleString("en-CA")}`;
}

function formatSavedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function PersonalizedCatalog({ cards }: PersonalizedCatalogProps) {
  const [profile, setProfile] = useState<SavedCardProfile | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("catalogue");

  useEffect(() => {
    const saved = loadCardProfile();
    if (!saved || saved.results.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(saved);
    setSortMode("best");
  }, []);

  const resultMap = useMemo(() => {
    const map = new Map<string, { rank: number; netValue: number }>();
    profile?.results.forEach((result, index) => {
      map.set(result.id, { rank: index + 1, netValue: result.netValue });
    });
    return map;
  }, [profile]);

  const displayedCards = useMemo(() => {
    if (!profile || sortMode !== "best") return cards;
    return cards
      .map((card, originalIndex) => ({ card, originalIndex }))
      .sort((a, b) => {
        const aRank = resultMap.get(a.card.id)?.rank ?? Number.POSITIVE_INFINITY;
        const bRank = resultMap.get(b.card.id)?.rank ?? Number.POSITIVE_INFINITY;
        if (aRank !== bRank) return aRank - bRank;
        return a.originalIndex - b.originalIndex;
      })
      .map(({ card }) => card);
  }, [cards, profile, resultMap, sortMode]);

  const clearProfile = () => {
    clearCardProfile();
    setProfile(null);
    setSortMode("catalogue");
  };

  return (
    <>
      <div className={styles.personalization}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Personalized catalogue</span>
          {profile ? (
            <>
              <strong>Your calculator results can now follow you.</strong>
              <p>
                Best for me uses the exact eligible-card ranking from your last completed
                calculator run on {formatSavedDate(profile.savedAt)}. It is saved only in this browser.
              </p>
            </>
          ) : (
            <>
              <strong>Unlock Best for me.</strong>
              <p>
                Complete the 7-question calculator once and ClearFin will bring that ranking
                back here without an account or card number.
              </p>
            </>
          )}
        </div>

        <div className={styles.actions}>
          {profile ? (
            <div className={styles.toggle} aria-label="Catalogue sort">
              <button
                type="button"
                className={sortMode === "best" ? styles.active : undefined}
                onClick={() => setSortMode("best")}
              >
                Best for me
              </button>
              <button
                type="button"
                className={sortMode === "catalogue" ? styles.active : undefined}
                onClick={() => setSortMode("catalogue")}
              >
                Catalogue order
              </button>
            </div>
          ) : null}
          <Link href="/credit-card-calculator-canada" className={styles.recalculate}>
            {profile ? "Recalculate" : "Run the calculator"} →
          </Link>
          {profile ? (
            <button type="button" className={styles.clear} onClick={clearProfile}>
              Clear saved profile
            </button>
          ) : null}
        </div>
      </div>

      {profile && sortMode === "best" ? (
        <p className={styles.disclaimer}>
          Personalized order reflects your last completed calculator assumptions and estimated
          annual rewards after fees. Merchant coding, caps, point values and issuer terms can change;
          rerun the calculator when your spending or income changes.
        </p>
      ) : null}

      <div className="catalog-grid">
        {displayedCards.map((card) => {
          const match = resultMap.get(card.id);
          const detailId = card.id === "cobalt" ? "Amex-cobalt" : card.id;
          return (
            <Link href={`/credit-cards/${detailId}`} className="catalog-card" key={card.id}>
              <div className="catalog-card-art">
                <FinlyRebateBadge cardId={card.id} applicationUrl={card.bankUrl} />
                <Image
                  src={card.img}
                  alt={card.name}
                  fill
                  sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 280px"
                  style={{ objectFit: "contain" }}
                />
                {profile && sortMode === "best" && match ? (
                  <span className={styles.matchTag}>
                    #{match.rank} match · {formatNetValue(match.netValue)}/yr est. net
                  </span>
                ) : null}
              </div>
              <div className="catalog-card-copy">
                <span>{card.issuer}</span>
                <h3>{card.name}</h3>
                <p>{card.badge}</p>
                <div>
                  <small>Annual fee</small>
                  <strong>
                    {card.annualFee === null ? "See details" : card.annualFee === 0 ? "$0" : `$${card.annualFee}`}
                  </strong>
                </div>
                <em>View card details <b>→</b></em>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
