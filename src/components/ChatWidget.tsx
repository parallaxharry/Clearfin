"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/** Matches the status delimiter used by /api/chat. */
const RS = "\x1E";

const CLIENT_ID_KEY = "clearfin-ask-id";
const EMAIL_KEY = "clearfin-ask-email";

/**
 * Stable per-browser id so the prompt allowance survives reloads. Clearing
 * site data resets it — an accepted trade, since the alternative (keying off
 * IP alone) would lock out everyone behind a shared office or mobile network.
 */
function getClientId(): string {
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID(); // private mode — allowance lasts the page view
  }
}

const SUGGESTIONS = [
  "Best card for groceries?",
  "Which cards have no annual fee?",
  "Does the Cobalt charge FX fees?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Set when the server asks for an email before answering (HTTP 428). */
  const [emailGate, setEmailGate] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  /** Set when the lifetime allowance is spent (HTTP 429). */
  const [limitReached, setLimitReached] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  /** On a card detail page the assistant gets that card as context. */
  const cardId = pathname?.startsWith("/credit-cards/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = useCallback(
    async (text: string, emailOverride?: string) => {
      const question = text.trim();
      if (!question || busy || limitReached) return;

      setError(null);
      setEmailError(null);
      setInput("");
      const next: Msg[] = [...msgs, { role: "user", content: question }];
      // Placeholder goes in straight away so there is never a silent gap
      // between hitting send and the first token arriving.
      setMsgs([...next, { role: "assistant", content: "" }]);
      setStatus("Thinking");
      setBusy(true);

      const appendToLast = (text: string) =>
        setMsgs((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { role: "assistant", content: last.content + text };
          return copy;
        });

      try {
        let storedEmail: string | null = null;
        try {
          storedEmail = localStorage.getItem(EMAIL_KEY);
        } catch {
          /* private mode */
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next,
            cardId,
            clientId: getClientId(),
            email: emailOverride ?? storedEmail ?? undefined,
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          setMsgs(next); // drop the placeholder
          setBusy(false);
          setStatus(null);

          if (res.status === 428) {
            // Hold the question so it can be sent once we have an address.
            pendingRef.current = question;
            setMsgs(msgs);
            setEmailGate(data?.error ?? "Enter your email to keep going.");
          } else if (res.status === 429 && data?.reason === "limit_reached") {
            setLimitReached(data.error);
          } else {
            setError(data?.error ?? "Something went wrong. Please try again.");
          }
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          // Pull out any complete \x1E-wrapped status markers; the rest is prose.
          let text = "";
          for (;;) {
            const start = buf.indexOf(RS);
            if (start === -1) {
              text += buf;
              buf = "";
              break;
            }
            text += buf.slice(0, start);
            const end = buf.indexOf(RS, start + 1);
            if (end === -1) {
              buf = buf.slice(start); // marker split across chunks — wait
              break;
            }
            setStatus(buf.slice(start + 1, end));
            buf = buf.slice(end + 1);
          }

          if (text) {
            setStatus(null);
            appendToLast(text);
          }
        }
      } catch {
        setMsgs(next);
        setError("Couldn't reach the assistant. Please try again.");
      } finally {
        setBusy(false);
        setStatus(null);
      }
    },
    [busy, msgs, cardId, limitReached]
  );

  /** Submit the email gate, then replay the question that triggered it. */
  const submitEmail = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = emailInput.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setEmailError("Please enter a valid email address.");
        return;
      }
      try {
        localStorage.setItem(EMAIL_KEY, value);
      } catch {
        /* private mode — the address still reaches the server this request */
      }
      const question = pendingRef.current;
      pendingRef.current = null;
      setEmailGate(null);
      setEmailInput("");
      setEmailError(null);
      if (question) void send(question, value);
    },
    [emailInput, send]
  );

  return (
    <>
      <button
        type="button"
        className={`cf-chat-launcher${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="cf-chat-panel"
        aria-label={open ? "Close card assistant" : "Ask about credit cards"}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1 1 21 11.5Z" />
            </svg>
            <span>Ask</span>
          </>
        )}
      </button>

      {open && (
        <div className="cf-chat-panel" id="cf-chat-panel" role="dialog" aria-label="ClearFin card assistant">
          <header className="cf-chat-head">
            <div>
              <strong>Card assistant</strong>
              <small>Answers from ClearFin&apos;s live card data</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </header>

          <div className="cf-chat-body" ref={scrollRef}>
            {msgs.length === 0 && (
              <div className="cf-chat-intro">
                <p>
                  Ask me anything about Canadian credit cards — fees, earn rates, welcome
                  bonuses, or which card fits how you spend.
                </p>
                <div className="cf-chat-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={`cf-chat-msg cf-chat-${m.role}`}>
                {m.role === "assistant" ? (
                  m.content ? (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <Link href={href ?? "#"} onClick={() => setOpen(false)}>{children}</Link>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="cf-chat-thinking" role="status" aria-live="polite">
                      <span className="cf-chat-dots" aria-hidden="true"><i /><i /><i /></span>
                      <em>{status ?? "Thinking"}…</em>
                    </span>
                  )
                ) : (
                  m.content
                )}
              </div>
            ))}

            {error && <div className="cf-chat-error">{error}</div>}

            {emailGate && (
              <form className="cf-chat-gate" onSubmit={submitEmail}>
                <strong>Keep going — one detail first</strong>
                <p>{emailGate}</p>
                <div className="cf-chat-gate-row">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    aria-label="Your email address"
                    autoFocus
                  />
                  <button type="submit">Continue</button>
                </div>
                {emailError && <em className="cf-chat-gate-err">{emailError}</em>}
                <small>
                  We&apos;ll only use this to follow up about your questions. See our{" "}
                  <Link href="/privacy" onClick={() => setOpen(false)}>privacy policy</Link>.
                </small>
              </form>
            )}

            {limitReached && (
              <div className="cf-chat-limit">
                <strong>You&apos;ve used all your questions</strong>
                <p>{limitReached}</p>
                <a href="mailto:info@clearfin.ca">Email info@clearfin.ca</a>
              </div>
            )}
          </div>

          <form
            className="cf-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              maxLength={1000}
              disabled={!!limitReached || !!emailGate}
              placeholder={
                limitReached
                  ? "Question limit reached"
                  : emailGate
                    ? "Enter your email above to continue"
                    : "Ask about any Canadian card…"
              }
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim() || !!limitReached || !!emailGate}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
            </button>
          </form>

          <p className="cf-chat-foot">
            General information, not financial advice. ClearFin may earn a commission on
            some cards — it never affects rankings. <Link href="/disclosures" onClick={() => setOpen(false)}>Disclosures</Link>
          </p>
        </div>
      )}
    </>
  );
}
