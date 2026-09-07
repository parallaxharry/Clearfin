# Editorial and information-page follow-ups

This accompanies CF-32's interaction/layout checks. It is not an issuer-data, policy or legal sign-off. No external assignments or messages were sent; the owners below identify whose confirmation is needed for the next review.

## Corrected in this batch

- FAQ claimed statement uploads were available, contradicting the current privacy page and implemented website. Changed the shared FAQ answer (including its generated FAQ schema) to say uploads are not accepted and spending can be entered manually.
- Contents navigation was hidden on narrow screens; restored it and added keyboard focus transfer, hydrated deep-link handling and safe observer failure handling.
- Markdown article tables lacked scroll wrappers. Added labelled keyboard-scroll regions, matching category-table wrappers, with readable 14px table text.

## Separate editorial follow-ups

| Pages / content | What still needs review | Confirmation owner |
| --- | --- | --- |
| All six card category guides, everyday-spending article, dining article, welcome-offer article and points/combination guides | Check current fees, caps, merchant restrictions, welcome deadlines, rebate terms and source destinations against issuer terms; record genuine verification dates. Do not refresh dates just because the layout changed. | Prime SEO Hub for article/source review; ClearFin owner for approval; technical data corrections remain CF-02/03/05/26. |
| FAQ, About, early-access positioning and How ClearFin Helps | Confirm current vs planned features, launch timing, card/issuer counts and eligibility wording. In particular, “only cards you qualify for” should be reviewed alongside CF-05; calculator estimates are not lender decisions. | ClearFin owner/product lead. |
| Privacy, Disclosures and Contact | Confirm statements match actual collection, storage, vendors, retention, consent and affiliate relationships. Current mail links are usable; this does not certify inbox delivery or policy accuracy. | ClearFin owner and their privacy/legal adviser as appropriate. |
| Article citations and outbound application destinations | Review route-specific external destinations and current issuer/partner landing pages. Browser QA did not submit applications, follow redirects through application funnels or validate commercial terms. | Prime SEO Hub for editorial citations; ClearFin owner/affiliate contact for application links. |
| Database-only or subsequently added blog rows | Re-run the shared-template interaction checks and review factual claims/dates before publication. Local testing uses the source fallback catalogue/blogs; the live smoke check is recorded in this batch's pull request. | ClearFin owner and Prime SEO Hub. |

## Scope and reproducibility

- `npm run test:qa:catalogue` checks catalogue narrowing/reset, result counts, fee sorting, no-JS card discovery, 19 editorial/info routes, generated contents anchors, keyboard activation/focus, initial hash navigation, client navigation, labelled table scrolling, static FAQ answers, mail/footer destinations and zoom/reflow.
- FAQ answers are currently static and visible, not accordion controls. No accordion was invented solely to satisfy an audit assumption.
- Viewports of 1440px, 390px and 320px plus 200% CSS zoom are desktop-browser checks, not physical-phone or native screen-reader certification (CF-23/24 remain open).
- Existing canonical URLs, article dates, card copy/artwork and tracking settings are retained except the explicit statement-upload FAQ correction above.
