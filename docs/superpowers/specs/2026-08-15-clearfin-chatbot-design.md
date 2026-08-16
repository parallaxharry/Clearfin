# ClearFin card assistant — design

**Date:** 2026-08-15
**Status:** Approved for planning

A customer-facing chatbot on clearfin.ca, powered by OpenAI, grounded in the
Supabase `card_catalog` data, that answers questions about Canadian credit cards
and recommends specific cards.

## Goals

- Answer factual questions about any card in the catalogue (fees, earn rates,
  welcome bonuses, benefits, eligibility, FX fees) without inventing anything.
- Recommend specific cards when asked, using the same math the site already uses,
  so the bot and the calculator never disagree.
- Keep spend bounded and predictable on a public, unauthenticated endpoint.
- Capture what visitors actually ask, anonymously, as input for future content.

## Non-goals

- No user accounts, no chat history across sessions, no login.
- No vector search or embedding pipeline.
- No model-authored SQL.
- No advice beyond card comparison — the bot is not a licensed advisor and says so.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Bot scope | Recommends specific cards | Matches what ClearFin already does; refusing the most common question would feel evasive |
| Grounding | Whole slim catalogue in every prompt | 122 cards slim to ~6k tokens; no retrieval infrastructure needed and never stale |
| Detail access | `get_card_details` function call | Full records are ~161k tokens in total — far too large to inline, but fine on demand |
| Recommendations | `rank_cards` function calling existing `scoreCard` | Guarantees bot and calculator agree |
| Placement | Floating widget, bottom-right, site-wide | Highest usage; bottom-left and bottom-centre are already occupied |
| Spend protection | IP rate limit + daily spend cap | Public endpoint with no login; caps the blast radius of scripted abuse |
| Logging | Questions only, no identifiers | Real search intent for content planning without storing personal data |
| Model | `gpt-5-mini` | Verified on the account; input-heavy and reasoning-light workload doesn't justify the top tier. Escalate to `gpt-5` if golden questions fail |

## Architecture

### Request flow

1. Widget posts `{ messages, pageCardId? }` to `POST /api/chat`.
2. Route hashes the caller IP and checks two limits: per-IP daily message count,
   and a global daily token-spend ceiling. Either being exceeded short-circuits
   with a specific, friendly error.
3. Route assembles the OpenAI request: system prompt, slim catalogue, the last
   10 conversation turns, and the current card's ID when the user is on a card page.
4. OpenAI responds with either prose (streamed straight to the client) or a tool call.
5. Tool calls execute server-side, their results are appended, and a second
   OpenAI call produces the final answer.
6. Usage (token counts) is recorded for the spend cap; the user's question is
   recorded anonymously.

### Components

| File | Responsibility |
| --- | --- |
| `src/app/api/chat/route.ts` | The only holder of the OpenAI key. Orchestrates limits, prompt assembly, tool loop, streaming. |
| `src/lib/chatContext.ts` | Builds and caches the slim catalogue; owns the system prompt. |
| `src/lib/chatTools.ts` | Tool JSON schemas and their server-side executors. |
| `src/lib/rateLimit.ts` | IP-hash rate limiting and spend-cap checks against Supabase. |
| `src/components/ChatWidget.tsx` | Client UI: launcher, transcript, streaming, error and limit states. |
| `src/app/globals.css` | Widget styles, following existing conventions. |

Each module is independently testable: `chatContext` is a pure function of catalogue
data, `chatTools` executors take validated arguments and return plain objects, and
`rateLimit` returns an allow/deny decision.

### The slim catalogue

Per card: `id`, `name`, `issuer`, `annual_fee`, the five earn rates, `reward_program`,
`network`, `fx_fee`, `min_income_personal`, and the short description. Measured at
~22KB / ~6k tokens across all 122 rows.

Built from Supabase `card_catalog` and cached in-process for 5 minutes, matching the
ISR window used elsewhere on the site. If Supabase is unreachable, it falls back to
the static `CARDS` array in `src/lib/cards.ts`, the same fallback pattern already used
by `getRichSearchIndex` and the blog.

### Tools

**`get_card_details(card_ids: string[])`** — up to 4 IDs per call. Every ID is checked
against the known catalogue IDs before any query runs; unknown IDs are dropped and
reported back to the model rather than passed through. Returns welcome bonus, benefits,
earn caps, credit score guidance, pros and cons.

**`rank_cards(spend: { dining, grocery, gas, travel, other }, limit)`** — monthly dollar
amounts, each clamped to a sane range. Calls the existing `scoreCard` from
`src/lib/cards.ts` and returns the top N with their net annual value. This is the same
function powering the calculator, so results are consistent by construction.

### Model selection

**`gpt-5-mini`.** Verified available on the project's OpenAI account on 2026-08-15, by
querying `/v1/models` rather than relying on training data. The account exposes four
chat-capable models: `gpt-4o-mini`, `gpt-5`, `gpt-5-mini`, `gpt-5-nano`.

`gpt-5-mini` fits the shape of this workload. Every turn carries the same ~6k-token
catalogue, so the job is input-heavy but reasoning-light: read a table, write a clear
paragraph. That does not justify the top tier, and the two smallest models are a
false economy if they misread a fee.

The model name lives in a single exported constant so it can be changed in one place.
Escalate to `gpt-5` if the golden-question set shows factual errors on fees, rates or
bonuses — accuracy on card facts is the one thing this feature cannot trade away.

## Guardrails

- **Scope lock.** The system prompt restricts the bot to Canadian credit cards and
  ClearFin's own tools; it declines anything else briefly and redirects.
- **No invention.** The bot answers only from the catalogue and tool results. If a
  card or fact is not present, it says it does not have that information rather than
  guessing. This is the highest-severity failure mode for a financial site.
- **Linking.** Every card named links to `/credit-cards/<id>`.
- **Disclosure.** The widget shows a persistent "general information, not financial
  advice" line and the affiliate disclosure. This is a third surface needing the
  affiliate disclosure, alongside the card modals and `/credit-cards` pages already
  identified as missing it.
- **Injection resistance.** User text never reaches a query. Tool arguments are
  validated and clamped before execution.
- **Input caps.** Message length capped at 1,000 characters; history capped at 10 turns.

## Rate limiting and spend

A Supabase table `chat_usage` stores, per UTC day: a salted hash of the IP, message
count, and accumulated token counts. Two checks run before each OpenAI call:

- Per-IP: 20 messages per UTC day.
- Global: a daily token ceiling set by environment variable. On breach the bot returns
  a fixed "unavailable, try the calculator" response and logs the event.

The IP is never stored raw — only `sha256(ip + server_salt)`. This reduces exposure but
is not anonymisation: a hashed IP is still capable of distinguishing one visitor from
another, so it should be treated as personal data and covered by the privacy policy.
Counters reset by date, and rows older than 7 days are pruned.

## Logging

A `chat_questions` table stores the question text, the card IDs the bot referenced, a
timestamp, and nothing else — no IP, no session ID, no assistant text. Purpose is
content planning: recurring questions become blog posts and FAQ entries.

## Error handling

| Failure | Behaviour |
| --- | --- |
| OpenAI timeout or error | Friendly message pointing at the calculator and search; error logged server-side |
| Per-IP limit hit | Message stating the limit and when it resets |
| Daily spend cap hit | Bot disables itself for the day, shows fallback message, logs the event |
| Supabase unreachable | Slim catalogue falls back to static `cards.ts`; chat still works |
| Tool called with unknown card ID | ID dropped, model told it was invalid, answer continues |

## Testing

**Unit** — slim-catalogue builder shape and size; rate-limit allow/deny including the
day boundary; tool-argument validation, especially unknown IDs and out-of-range spend.

**Golden questions** — roughly twenty real questions with expected grounded facts drawn
from the catalogue, covering factual lookup ("does the Cobalt charge FX fees"),
structured filters ("cheapest card with lounge access"), recommendations ("best card if
I spend $900 a month on groceries"), an off-topic prompt that must be declined, and an
injection attempt that must not alter behaviour. Assertions target facts and links, not
exact wording.

**Manual** — widget on mobile and desktop, streaming, and each error state, with
screenshots before sign-off.

## Environment variables

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Server-side only. Must never be prefixed `NEXT_PUBLIC_`. |
| `CHAT_DAILY_TOKEN_CAP` | Global daily token ceiling. |
| `CHAT_IP_SALT` | Salt for hashing IPs in the rate-limit table. |

`SUPABASE_SERVICE_ROLE_KEY` is already used by `track-click` and will be reused for
writing usage counters.

## Supabase changes

Two new tables, `chat_usage` and `chat_questions`. Per the established workflow, the
SQL will be written to `scripts/` for the user to run — this project's Supabase access
from the agent side is read-only.

## Out of scope for v1

Dedicated `/ask` page, conversation history across sessions, multilingual support,
voice input, and comparing more than the catalogue (no live issuer scraping).
