"use client";

import { useState } from "react";
import { askAssistant } from "@/lib/askAssistant";

/**
 * Home hero chat bar. Typing here opens the site-wide card assistant
 * (ChatWidget) with the question already sent, so there is one conversation,
 * one prompt allowance and one email gate — not a second chatbot.
 */
export default function HeroChatBar() {
  const [value, setValue] = useState("");

  return (
    <form
      className="hero-chat"
      role="search"
      aria-label="Ask the ClearFin card assistant"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        askAssistant(q);
        if (q) setValue("");
      }}
    >
      <svg className="hero-chat-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-4.6A8.4 8.4 0 1 1 21 11.5Z" />
      </svg>
      <label htmlFor="hero-chat-input" className="sr-only">
        Ask a question about Canadian credit cards
      </label>
      <input
        id="hero-chat-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about any card…"
        autoComplete="off"
        enterKeyHint="send"
        maxLength={500}
      />
      <button type="submit" aria-label="Ask the card assistant">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
