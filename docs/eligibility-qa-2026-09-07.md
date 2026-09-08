# Calculator income checks — 7 September 2026

Scope: CF-05, based on production main 2f3dbe2a0cc0c6d7f56af24d9f103e9bac864e05. This is a safer model for recorded requirements, not an issuer-data audit or an approval predictor.

## Changes

- Optional household income is part of the existing personal-income step. There are still seven steps. Blank is valid; a supplied total must include personal income and cannot exceed $10 million. Invalid entries explain the correction and block Next.
- The shared profile holds the value only in memory for this tab. Back and client-side page navigation preserve it; Restart and reload clear it. No browser storage, database field, analytics event or URL parameter was added for this answer.
- The catalogue reads its existing min_income_household field alongside personal income. Missing, invalid and unavailable data stay unknown, not zero. Query errors or thrown failures produce the safe unknown state.
- Either recorded personal or household threshold can satisfy the income check. Unknown alternatives or an omitted household answer cannot prove failure. Only two known, answered, unmet thresholds exclude a card from this spending shortlist. Other routes, including assets, are not assessed.
- Each result and details dialog distinguishes a recorded income check from an approval decision. Missing data is labelled "Income requirements need checking". Estimated credit-score ranges are guidance, no longer hard exclusion rules.
- Result and empty-state copy explains the limits. Metadata/HowTo wording no longer calls this an eligibility prediction. SEO paths, titles, canonical URLs, card economics, reward scoring and tracking configuration are unchanged.

## Verification

- 36 unit tests pass, including personal/household boundaries, unknown versus explicit zero, invalid values, catalogue aliases/query failure and profile clearing. Focused ESLint, TypeScript and final 162-route production build pass.
- Local-only synthetic fixture: personal $35,000 and household $100,000 satisfy a recorded $60,000/$100,000 alternative; household $90,000 produces the honest empty state. An estimated score below the fixture range does not exclude the card. An unavailable catalogue yields three explicitly unknown cards, not positive eligibility claims. These numbers are test fixtures, not issuer facts.
- Fixture route was removed before the final build and is not published. Optional QA_ELIGIBILITY_FIXTURE mode in the browser script is restricted to localhost and requires recreating that local fixture; normal mode needs no test route.
- Browser checks cover input validation, Back, Calculator/Compare navigation, reset/reload, results/dialog labels, no localStorage answer, no submitted household value and 390/320px reflow. Desktop household-match and mobile input/results screenshots reviewed. This is browser viewport QA, not physical-phone certification.
- Run npm run test:qa:eligibility against a production-mode local server on port 3100, or set QA_BASE_URL to a verified deployment. PLAYWRIGHT_MODULE and QA_BROWSER_CHANNEL can select an installed Playwright runtime and isolated Chrome. Write endpoints are intercepted and optional tracking is denied; no real applications, leads or chat requests.
- Preview, exact published-file matching, production deployment and public-site regression evidence are recorded in the release pull request.

## Source check and remaining limits

Checked 7 September 2026: [Scotiabank's Passport page](https://www.scotiabank.com/ca/en/personal/credit-cards/visa/passport-infinite-card.html) describes personal-income, household-income and assets alternatives; its displayed ranges are not a reason to invent a single replacement catalogue threshold. [FCAC credit report and score basics](https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/credit-report-score-basics.html) explains that a consumer's score may differ from a lender's score. These support the distinction between guidance and underwriting, not a complete current-terms audit.

CF-02 reward caps/merchant conditions, CF-03 consistent card economics and CF-26 current issuer offers/requirements remain open. No claim that all catalogue requirements are current or that assets/residency/age/issuer policies are fully modelled. Real-device QA, account-side analytics receipt and infrastructure protections remain separate backlog items. The same nine existing dependency advisories remain; no dependency upgrade is included.
