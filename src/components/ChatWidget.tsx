"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Msg {
  role: "user" | "assistant";
  content: string;
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
  const [error, setError] = useState<string | null>(null);
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
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      setError(null);
      setInput("");
      const next: Msg[] = [...msgs, { role: "user", content: question }];
      setMsgs(next);
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, cardId }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          setError(data?.error ?? "Something went wrong. Please try again.");
          setBusy(false);
          return;
        }

        setMsgs((m) => [...m, { role: "assistant", content: "" }]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMsgs((m) => {
            const copy = [...m];
            copy[copy.length - 1] = {
              role: "assistant",
              content: copy[copy.length - 1].content + chunk,
            };
            return copy;
          });
        }
      } catch {
        setError("Couldn't reach the assistant. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, cardId]
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
                    <span className="cf-chat-dots" aria-label="Thinking"><i /><i /><i /></span>
                  )
                ) : (
                  m.content
                )}
              </div>
            ))}

            {error && <div className="cf-chat-error">{error}</div>}
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
              placeholder="Ask about any Canadian card…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
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
