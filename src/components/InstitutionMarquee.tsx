"use client";

import Image from "next/image";
import { useState } from "react";

const INSTITUTIONS = [
  { name: "American Express", mark: "AMEX", tone: "amex", logos: ["https://www.americanexpress.com/apple-touch-icon.png", "https://www.americanexpress.com/favicon.ico"] },
  { name: "Scotiabank", mark: "S", tone: "scotia", logos: ["https://www.scotiabank.com/content/dam/scotiabank/images/logos/2023/scotiabank-logo-red-mobile.svg", "https://www.scotiabank.com/favicon.ico"] },
  { name: "TD", mark: "TD", tone: "td", logos: ["https://www.td.com/etc.clientlibs/tdsite/clientlibs/clientlib-wealth/resources/images/favicon.ico"] },
  { name: "RBC", mark: "RBC", tone: "rbc", logos: ["https://www.rbcroyalbank.com/favicon.ico"] },
  { name: "BMO", mark: "BMO", tone: "bmo", logos: ["https://www.bmo.com/apple-touch-icon.png", "https://www.bmo.com/favicon.ico"] },
  { name: "CIBC", mark: "CIBC", tone: "cibc", logos: ["https://www.cibc.com/apple-touch-icon.png", "https://www.cibc.com/favicon.ico"] },
  { name: "National Bank", mark: "NB", tone: "nbc", logos: ["https://www.nbc.ca/apple-touch-icon.png", "https://www.nbc.ca/favicon.ico"] },
  { name: "Desjardins", mark: "D", tone: "desjardins", logos: ["https://www.desjardins.com/favicon.ico"] },
  // MBNA publishes no square mark: the wordmark is 352×108 and squashes badly
  // in the 30px slot, and the favicon is only 16×16 and blurs when scaled. So
  // the badge reproduces the wordmark instead — lowercase "mbna" in white on
  // the brand navy, styled in .institution-mark--mbna.
  { name: "MBNA", mark: "mbna", tone: "mbna", logos: [] },
  { name: "PC Financial", mark: "PC", tone: "pc", logos: ["https://www.pcfinancial.ca/favicon.ico"] },
  { name: "Wealthsimple", mark: "W", tone: "wealthsimple", logos: ["https://www.wealthsimple.com/apple-touch-icon.png", "https://www.wealthsimple.com/favicon.ico"] },
  { name: "Tangerine", mark: "T", tone: "tangerine", logos: ["https://www.tangerine.ca/etc.clientlibs/tangerine/clientlibs/clientlib-site/resources/icon-192x192.png"] },
  { name: "Simplii", mark: "S", tone: "simplii", logos: ["https://www.simplii.com/apple-touch-icon.png", "https://www.simplii.com/favicon.ico"] },
  { name: "Rogers Bank", mark: "R", tone: "rogers", logos: ["https://www.rogersbank.com/favicon.ico"] },
  { name: "Canadian Tire Bank", mark: "CT", tone: "triangle", logos: ["https://media.ctfs.com/dash_icons/favicons/CTB_Favicon_EN_192x192.png?im=scale&scl=1"] },
  { name: "ATB Financial", mark: "ATB", tone: "atb", logos: ["https://www.atb.com/static/img/apple-touch-icon-180x180.png", "https://www.atb.com/static/img/favicon-48x48.png"] },
  { name: "Neo Financial", mark: "NEO", tone: "neo", logos: ["/issuer-logos/neo-financial.svg"] },
  { name: "Brim Financial", mark: "BRIM", tone: "brim", logos: ["https://static.brimfinancial.com/brim/images/logo-1.png"] },
  { name: "Capital One", mark: "C1", tone: "capital-one", logos: ["https://www.capitalone.com/assets/shell/apple-touch-icon.png", "https://www.capitalone.com/assets/shell/favicon.ico"] },
] as const;

function InstitutionLogo({
  name,
  mark,
  tone,
  logos,
}: (typeof INSTITUTIONS)[number]) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const source = logos[sourceIndex];

  return (
    <span className={`institution-mark institution-mark--${tone}`} aria-hidden="true">
      <span className={loaded ? "institution-logo-fallback is-hidden" : "institution-logo-fallback"}>
        {mark}
      </span>
      {source ? (
        <Image
          className={loaded ? "institution-logo is-loaded" : "institution-logo"}
          src={source}
          alt=""
          width={30}
          height={30}
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setSourceIndex((current) => current + 1);
          }}
          title={`${name} official mark`}
        />
      ) : null}
    </span>
  );
}

function InstitutionRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="institution-row" aria-hidden={hidden || undefined}>
      {INSTITUTIONS.map((institution) => (
        <li className="institution-item" key={institution.name}>
          <InstitutionLogo {...institution} />
          <span className="institution-name">{institution.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InstitutionMarquee() {
  return (
    <section className="institution-network" aria-labelledby="institution-network-title">
      <div className="institution-network-copy">
        <p className="institution-network-eyebrow">121 cards · 19 issuers · one independent view</p>
        <h2 id="institution-network-title">
          One catalogue. <span>Canada&apos;s leading card issuers.</span>
        </h2>
        <p>
          Compare cards across the institutions Canadians already know—without opening
          nineteen different websites.
        </p>
      </div>

      <div className="institution-marquee" aria-label="Financial institutions in the ClearFin catalogue">
        <div className="institution-track">
          <InstitutionRow />
          <InstitutionRow hidden />
        </div>
      </div>

      <div className="institution-routing-note">
        <span className="institution-routing-icon" aria-hidden="true">↗</span>
        <p>
          ClearFin compares independently—it is not a bank partnership. When you choose
          Apply, some application journeys continue through <strong>FinlyWealth</strong> or
          directly to the issuing institution.
        </p>
      </div>
    </section>
  );
}
