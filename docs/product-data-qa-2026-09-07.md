# ClearFin product-data QA — 2026-09-07

## Result

- 126 unique local credit-card detail routes are generated and covered by the verification queue.
- 126/126 products have a traceable official issuer source and a review date inside the 45-day freshness window.
- 43 welcome offers are tracked. An offer is automatically hidden when its official source is missing or its review is older than 45 days.
- 24 products now have explicit calculator rules for caps, shared caps, partner merchants, per-litre fuel rewards, or account-dependent earning rates.
- Annual fees and category rates use one resolved product record across catalogue, detail, calculator, and comparison views.

The earlier roadmap count of 127 referred to the old catalogue snapshot. The current build contains 126 unique product IDs and generates 126 corresponding card detail paths.

## Conservative calculator policy

The calculator does not assume a shopper uses a specific partner store, owns a qualifying telecom service, buys a particular number of fuel litres, or remains below a spending cap unless that information is available. Conditional headline rates stay visible in the product copy, while the estimate uses a supported conservative rate and explains the assumption beside the result.

The explicit models currently cover selected products from American Express, Scotiabank, BMO, MBNA, PC Financial, Rogers Bank, Canadian Tire, and Simplii Financial. Products without a recorded special rule display a notice that the listed category rates are being treated as flat and that current issuer terms should be confirmed.

## Current corrections included

- BMO CashBack World Elite: annual fee corrected to $139 and monthly grocery/gas limits modelled.
- Scotia Gold Amex: current 50,000-point offer and November 1, 2026 deadline recorded; the general-grocery estimate uses 5x rather than the partner-only 6x rate.
- Scotia Passport, Scene+ Visa, and Scotiabank Amex: partner-grocer headline rates are no longer assumed for generic grocery spend.
- Scotia Momentum Visa Infinite: restaurant dining uses the 1% base rate; the 2% food rate is limited to eligible delivery merchants.
- PC Financial cards: Loblaw-banner and per-litre fuel rewards are shown as conditional and are not applied to generic spend.
- Rogers cards: estimates use the published no-qualifying-service rate; service-linked, foreign-currency, and redemption bonuses remain conditional.
- American Express SimplyCash, MBNA, BMO, Simplii, and Triangle products: published category limits and after-cap rates are included where directly supported.

## Verification workflow

Run:

```text
npm run generate:product-verification
npm run test:qa:product-data
npm run test:qa
```

The generated queue at `docs/product-verification-queue-2026-09-07.json` lists each product's official source, review date, freshness state, conditional-calculator coverage, and every affected website route. It is intended to be regenerated whenever a product record changes.

## Primary sources checked for this batch

- American Express Canada card and benefit pages
- Scotiabank card product and Scene+ earning pages
- BMO card product pages
- MBNA card product and rewards pages
- PC Financial credit-card pages
- Rogers Bank card product and rewards pages
- Canadian Tire Financial Services card pages
- Simplii Financial Cash Back Visa page

Issuer terms can change. The queue and 45-day freshness rule are the operational control; this report is a dated release record, not a permanent claim that offers remain unchanged.
