"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <form className="wait-form reveal" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.ca"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={status === "success" ? "success" : ""}
        >
          {status === "loading"
            ? "Adding..."
            : status === "success"
            ? "✓ You're on the list"
            : "Get Early Access →"}
        </button>
      </form>
      {errorMsg && <div className="wait-error">{errorMsg}</div>}
    </>
  );
}
