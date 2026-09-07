"use client";

import { useEffect, useId, useRef, useState } from "react";
import { trackMetaAction } from "@/lib/metaPixel";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (request.current || status === "success") return;

    const address = email.trim();
    if (address.length > 254 || address.split("@")[0].length > 64 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (request.current !== controller) return;
      if (controller.signal.aborted) throw new Error("timeout");
      if (res.ok && typeof data?.created === "boolean") {
        setStatus("success");
        setEmail("");
        // Existing addresses receive the same success UI without a second lead.
        if (data.created === true) trackMetaAction("Lead");
      } else {
        setErrorMsg(typeof data?.error === "string" ? data.error : "We couldn't confirm your signup. Please try again.");
        setStatus("error");
      }
    } catch {
      if (request.current !== controller) return;
      setErrorMsg(controller.signal.aborted ? "This is taking too long. Your email is still here — please try again." : "Couldn't connect. Check your connection and try again.");
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) request.current = null;
    }
  };

  return (
    <>
      <form className="wait-form" onSubmit={handleSubmit}>
        <input
          type="email"
          aria-label="Email address for early access"
          autoComplete="email"
          maxLength={254}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? messageId : undefined}
          placeholder="your@email.ca"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={status === "success" ? "success" : ""}
        >
          {status === "loading"
            ? "Adding..."
            : status === "success"
            ? "✓ You're on the list"
            : status === "error"
            ? "Try again →"
            : "Get Early Access →"}
        </button>
      </form>
      <div role="status" aria-live="polite" aria-atomic="true" className="cf-sr-only">
        {status === "loading" ? "Adding..." : status === "success" ? "You're on the list" : ""}
      </div>
      <div id={messageId} role="alert" aria-atomic="true" className={errorMsg ? "wait-error" : "cf-sr-only"}>{errorMsg}</div>
    </>
  );
}
