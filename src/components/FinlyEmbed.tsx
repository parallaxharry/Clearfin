"use client";

import { useEffect } from "react";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import {
  FINLY_AFFILIATE_ID,
  FINLY_EMBED_SCRIPT,
  FINLY_EMBEDS,
} from "@/lib/finlyEmbeds";
import styles from "./FinlyEmbed.module.css";

declare global {
  interface Window {
    FinlyEmbed?: { loaded?: boolean; mountAll?: () => void };
  }
}

/**
 * Loads FinlyWealth's embed.js once. On later mounts (client-side navigation,
 * or a second embed on the page) it asks the already-loaded loader to pick up
 * the new <div> — embed.js exposes window.FinlyEmbed.mountAll() for this.
 */
function mountFinlyEmbeds() {
  if (window.FinlyEmbed?.loaded && window.FinlyEmbed.mountAll) {
    window.FinlyEmbed.mountAll();
    return;
  }
  if (document.querySelector(`script[src="${FINLY_EMBED_SCRIPT}"]`)) return;
  const script = document.createElement("script");
  script.src = FINLY_EMBED_SCRIPT;
  script.async = true;
  document.body.appendChild(script);
}

export default function FinlyEmbed({ embedKey }: { embedKey: string }) {
  const config = FINLY_EMBEDS[embedKey];

  useEffect(() => {
    if (config) mountFinlyEmbeds();
  }, [config]);

  if (!config) return null;

  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>{config.intro}</p>
      <AffiliateDisclosure compact rebates />
      {/* FinlyWealth's documented embed markup — do not restyle or alter. */}
      <div
        data-finly-tool={config.tool}
        data-affiliate={FINLY_AFFILIATE_ID}
        {...(config.embedId ? { "data-embed": config.embedId } : {})}
      />
    </div>
  );
}
