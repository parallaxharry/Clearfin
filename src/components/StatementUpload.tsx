"use client";

import { useState } from "react";

export default function StatementUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [consultEmail, setConsultEmail] = useState("");
  const [consultSent, setConsultSent] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    // Future: parse statement and calculate leak
    setTimeout(() => setSubmitted(true), 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultEmail || consultLoading) return;
    setConsultLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: consultEmail, source: "consultation" }),
      });
      setConsultSent(true);
    } catch {
      setConsultSent(true); // Optimistic
    } finally {
      setConsultLoading(false);
    }
  };

  return (
    <section className="feat" id="statement">
      <div className="section-num">04 / Analyse Your Cards</div>
      <div className="statement-wrap">

        {/* Left: Statement Upload */}
        <div className="statement-left reveal">
          <div className="statement-eyebrow">Upload · Instant analysis</div>
          <h2 className="statement-title">
            Find out exactly how much <span className="ital">you&apos;re losing.</span>
          </h2>
          <p className="statement-body">
            Upload your credit card statement (PDF or CSV). We&apos;ll scan every transaction,
            cross-reference our 107-card database, and show you the exact dollar amount you
            left unclaimed — category by category.
          </p>

          {!submitted ? (
            <div
              className={`upload-box${dragOver ? " drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("stmt-file-input")?.click()}
            >
              <input
                id="stmt-file-input"
                type="file"
                accept=".pdf,.csv,.xlsx"
                style={{ display: "none" }}
                onChange={handleFileInput}
              />
              <div className="upload-icon">📄</div>
              <div className="upload-title">
                {dragOver ? "Drop it!" : "Upload your statement"}
              </div>
              <div className="upload-sub">Drag & drop or click to browse</div>
              <div className="upload-formats">PDF · CSV · XLSX — All major banks supported</div>
            </div>
          ) : (
            <div className="upload-success">
              <div className="upload-success-icon">✓</div>
              <div className="upload-success-title">Statement received</div>
              <div className="upload-success-body">
                We&apos;re building full statement analysis — join the waitlist below to be
                first to know when it launches. We&apos;ll send your personalised report the
                moment it&apos;s ready.
              </div>
              <a href="#waitlist" className="consult-btn" style={{ marginTop: "20px" }}>
                Join Waitlist →
              </a>
            </div>
          )}
        </div>

        {/* Right: Book a Consultation */}
        <div className="statement-right reveal">
          <div className="consult-card">
            <div className="consult-eyebrow">Free · 30 minutes</div>
            <div className="consult-title">Book a card strategy session</div>
            <p className="consult-body">
              Talk to a ClearFin expert. We&apos;ll review your spending profile, current
              card lineup, and build you a personalised card strategy — completely free.
            </p>
            <div className="consult-items">
              <div className="consult-item">Personalised card stack recommendation</div>
              <div className="consult-item">Annual fee vs. rewards analysis</div>
              <div className="consult-item">Welcome bonus timing strategy</div>
              <div className="consult-item">ClearSave offer matching for your merchants</div>
            </div>

            {!consultSent ? (
              <form onSubmit={handleConsult} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="email"
                  placeholder="your@email.ca"
                  required
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  style={{
                    background: "rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "4px", padding: "12px 16px", color: "var(--ink)",
                    fontFamily: "var(--font-archivo)", fontSize: "14px",
                  }}
                />
                <button type="submit" className="consult-btn" disabled={consultLoading}>
                  {consultLoading ? "Booking..." : "Book Free Consultation →"}
                </button>
              </form>
            ) : (
              <div style={{ color: "var(--accent-emerald)", fontFamily: "var(--font-jetbrains)", fontSize: "11px", letterSpacing: ".2em" }}>
                ✓ WE&apos;LL BE IN TOUCH WITHIN 24 HOURS
              </div>
            )}

            <div style={{ marginTop: "20px", fontFamily: "var(--font-jetbrains)", fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
              No obligations · Free forever for early users
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}
