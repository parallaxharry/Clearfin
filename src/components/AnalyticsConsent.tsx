"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "clearfin-analytics-consent";

type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setShowBanner(window.localStorage.getItem(CONSENT_KEY) === null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function saveChoice(choice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, choice);
    window.gtag?.("consent", "update", {
      analytics_storage: choice,
    });
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <aside
      className="analytics-consent"
      aria-label="Analytics cookie preferences"
      aria-live="polite"
    >
      <div>
        <strong>Help us improve ClearFin?</strong>
        <p>
          We use Google Analytics to understand which pages are useful. You can
          accept or decline analytics cookies. Your card comparison choices
          still work either way.{" "}
          <a href="/privacy">Read our privacy statement.</a>
        </p>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" onClick={() => saveChoice("denied")}>
          Decline
        </button>
        <button
          type="button"
          className="analytics-consent-accept"
          onClick={() => saveChoice("granted")}
        >
          Accept analytics
        </button>
      </div>
    </aside>
  );
}
