"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/trackingConsent";

export default function CookiePreferencesButton() {
  return (
    <button type="button" className="cookie-preferences-button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      Cookie preferences
    </button>
  );
}
