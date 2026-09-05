"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY, MARKETING_CONSENT_KEY, OPEN_CONSENT_EVENT,
  readConsent, saveConsent,
} from "@/lib/trackingConsent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const loadChoices = (forceOpen = false) => {
      const savedAnalytics = readConsent(ANALYTICS_CONSENT_KEY);
      const savedMarketing = readConsent(MARKETING_CONSENT_KEY);
      setAnalytics(savedAnalytics === "granted");
      setMarketing(savedMarketing === "granted");
      setShowBanner(forceOpen || savedAnalytics === null || savedMarketing === null);
    };
    const frame = window.requestAnimationFrame(() => loadChoices());
    const open = () => loadChoices(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_CONSENT_EVENT, open);
    };
  }, []);

  function saveChoices(allowAnalytics: boolean, allowMarketing: boolean) {
    saveConsent(allowAnalytics ? "granted" : "denied", allowMarketing ? "granted" : "denied");
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <aside
      className="analytics-consent"
      aria-label="Cookie preferences"
      aria-live="polite"
    >
      <div>
        <strong>Help us improve ClearFin?</strong>
        <p>
          Choose whether to allow Google Analytics for website usage and Meta
          Pixel for advertising measurement. The calculator and comparisons work
          with optional cookies turned off.{" "}
          <a href="/privacy">Read our privacy statement.</a>
        </p>
        <div className="consent-options">
          <label><input type="checkbox" checked={analytics}
            onChange={(event) => setAnalytics(event.target.checked)} /> Analytics (Google)</label>
          <label><input type="checkbox" checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)} /> Advertising (Meta)</label>
        </div>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" onClick={() => saveChoices(false, false)}>
          Reject optional
        </button>
        <button type="button" onClick={() => saveChoices(analytics, marketing)}>Save choices</button>
        <button
          type="button"
          className="analytics-consent-accept"
          onClick={() => saveChoices(true, true)}
        >
          Accept all
        </button>
      </div>
    </aside>
  );
}
