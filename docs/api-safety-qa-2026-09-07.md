# API input safety — 7 September 2026

Batch 10, part of CF-28. Based on current production main 7c25c692e7e88f5fa4dd736bd70c44980deebf0e. CF-28 remains OPEN: application input handling is improved, but full deployed abuse controls, database policies and monitoring are not certified.

## Implemented

| Endpoint | Maximum JSON body | Preserved behaviour |
| --- | --- | --- |
| /api/track-click | 1,024 UTF-8 bytes | Consent assertion first; one card ID; no application-link blocking |
| /api/waitlist | 4,096 UTF-8 bytes | Email/source validation; duplicate-safe success; existing signup flow |
| /api/chat | 65,536 UTF-8 bytes | Up to 10 context messages, each at most 1,000 characters; existing email/lifetime gates and model logic |

- All three accept application/json (including a charset parameter). Wrong media type returns 415, malformed/invalid data 400, excessive bytes 413, and an unfinished body 408 after a 10-second application read deadline. Missing chat configuration still returns 503 before reading, as before.
- Reader checks declared length before reading and actual bytes while reading, so a missing or falsely small Content-Length cannot bypass the application limit. It cancels rejected/stalled streams without waiting for a sender to acknowledge cancellation. Invalid UTF-8 is rejected. This does not guarantee the hosting proxy has not already buffered data and is not a slow-client/DoS defence at the edge.
- Chat validates the entire bounded object/history before session lookup, logging or paid-model work. Null bodies, null/malformed prior messages, invalid roles, oversized fields and unexpected fields no longer reach downstream code. Waitlist also rejects unexpected fields.
- Chat widget sends the last ten context messages and shortens assistant context to the existing server limit. It does not shorten displayed answers/history or silently truncate an oversized new question. The server already used this ten-message/1,000-character context; model context and conversation UI are preserved.
- Fixed waitlist exception and chat provider-failure diagnostics omit raw exception messages. This is not an audit of every log in the application. Existing streaming failure/retry and accounting behavior are unchanged.
- No visual redesign, issuer-data changes, SEO paths, analytics IDs/consent changes, dependencies, database writes/migrations, hosting plan or firewall setting changes.

## Verification

- 46 unit tests pass: UTF-8 exact boundaries, invalid encoding/media type, declared oversize before reading, chunked/falsely small lengths, cancellation, stalled/broken streams, full chat schema, context preservation and no downstream work for malformed input. Valid mocked chat streams/accounting and provider failure diagnostics are tested. Existing tracking, eligibility and waitlist tests pass using real Request bodies and mocked external services.
- Focused ESLint, TypeScript and production build pass (162 routes; local fallback catalogue). Same nine existing dependency advisories; no forced upgrade.
- New isolated Chrome suite checks seven successful mocked turns, bounded ten-message requests, full visible long answers, retry after 413 and mobile reflow. Existing recovery suite passes both signup forms, chat timeout/Stop/retry/email/allowance gates and error/not-found navigation.
- Four tiny invalid-request probes check deployed handlers without any valid email, card, client identity or question: waitlist wrong media type and null body, chat null body, click wrong media type with consent assertion. These cannot create valid records or invoke the paid model. No production spam, concurrency, flood or slow-upload testing. Oversized/stalled body cases are local unit fixtures only.
- Run npm run test:qa and npm run test:qa:api. Browser script accepts QA_BASE_URL, PLAYWRIGHT_MODULE and QA_BROWSER_CHANNEL. It intercepts all page submissions; its four separate direct probes contain invalid bodies only. Release evidence and final public-site checks are recorded in this batch's pull request.

## Read-only deployment observations and remaining work

Signed-in Vercel verified the actual live repository, main commit and www.clearfin.ca. Firewall overview showed Firewall active, Custom Rules 0 and Bot Protection Inactive on 7 September 2026. This is a settings observation, not proof of full endpoint coverage, attack resistance or a confirmed exploitable vulnerability. No settings changed.

[Vercel's function limits](https://vercel.com/docs/functions/limitations), checked 7 September 2026, document a platform 4.5 MB body ceiling; that is not endpoint-specific rate limiting and is much larger than these application inputs. [MDN reader lock documentation](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/releaseLock), checked the same day, informs reader cleanup. The installed Next 16.2.4 Route Handlers guide was read before changes.

Follow-ups required before CF-28 is complete:

- Maintainer/owner: choose and test durable endpoint-specific rate/budget controls in staging, including shared-IP behavior. Do not substitute a per-instance memory counter for distributed enforcement. No automatic firewall changes or plan upgrades authorized by this report.
- Database maintainer: inspect actual deployed grants, row policies and chat RPC definitions with a non-production fixture. Repository card-click setup SQL enables RLS and creates no public policies, but this does not establish what is deployed. Waitlist uses the anonymous key; actual allowed operations need verification.
- Chat maintainer: separately address session/daily-usage lookup failures that currently fall back to zero/false, plus concurrent budget reservation and accounting failure handling. Browser client IDs are not authentication and can be reset. This batch does not claim a hard global cost ceiling or race-free per-user allowance.
- Owner/maintainer: confirm production log/alert routing, request limits, deployment protections and secret/environment presence without exposing values. No alert destination or database policy was changed here.

Checklist: **25/38 complete; 13 open**, including partially progressed CF-28. Do not increase the completed count for this batch.
