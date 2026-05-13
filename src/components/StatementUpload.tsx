"use client";

import { useState } from "react";

export default function StatementUpload() {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [statementEmail, setStatementEmail] = useState("");
  const [uploadUnlocked, setUploadUnlocked] = useState(false);
  const [uploadEmailLoading, setUploadEmailLoading] = useState(false);
  const [uploadEmailError, setUploadEmailError] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");

  const handleFile = async (file: File) => {
    if (!uploadUnlocked || fileUploading) return;

    setFileName(file.name);
    setFileUploading(true);
    setFileUploadError("");

    try {
      const formData = new FormData();
      formData.append("email", statementEmail);
      formData.append("file", file);

      const res = await fetch("/api/statement-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFileUploadError(data?.error || "Upload failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFileUploadError("Network error. Please try again.");
    } finally {
      setFileUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleStatementAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statementEmail || uploadEmailLoading) return;

    setUploadEmailLoading(true);
    setUploadEmailError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: statementEmail, source: "statement_upload" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setUploadEmailError(data?.error || "Enter a valid email to continue.");
        return;
      }

      setUploadUnlocked(true);
    } catch {
      setUploadEmailError("Network error. Please try again.");
    } finally {
      setUploadEmailLoading(false);
    }
  };

  return (
    <section className="feat" id="statement">
      <div className="section-num">04 / Analyse Your Cards</div>
      <div className="statement-wrap">
        <div className="statement-left reveal">
          <div className="statement-eyebrow">Upload - Instant analysis</div>
          <h2 className="statement-title">
            Find out exactly how much <span className="ital">you&apos;re losing.</span>
          </h2>
          <p className="statement-body">
            Upload your credit card statement (PDF or CSV). We&apos;ll scan every
            transaction, cross-reference our 107-card database, and show you the exact
            dollar amount you left unclaimed - category by category.
          </p>

          {!uploadUnlocked ? (
            <form className="statement-email-form" onSubmit={handleStatementAccess}>
              <input
                type="email"
                placeholder="your@email.ca"
                required
                value={statementEmail}
                onChange={(e) => setStatementEmail(e.target.value)}
              />
              <button type="submit" className="consult-btn" disabled={uploadEmailLoading}>
                {uploadEmailLoading ? "Checking..." : "Continue to Upload ->"}
              </button>
              {uploadEmailError && <div className="statement-email-error">{uploadEmailError}</div>}
              <div className="statement-email-note">
                Enter your email first so we can send your report when analysis is ready.
              </div>
            </form>
          ) : !submitted ? (
            <>
              <div
                className={`upload-box${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => {
                  if (!fileUploading) document.getElementById("stmt-file-input")?.click();
                }}
              >
                <input
                  id="stmt-file-input"
                  type="file"
                  accept=".pdf,.csv,.xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileInput}
                  disabled={fileUploading}
                />
                <div className="upload-icon">&#128196;</div>
                <div className="upload-title">
                  {fileUploading ? "Uploading..." : dragOver ? "Drop it!" : "Upload your statement"}
                </div>
                <div className="upload-sub">
                  {fileUploading ? "Securely storing your file" : "Drag & drop or click to browse"}
                </div>
                <div className="upload-formats">PDF / CSV / XLSX - All major banks supported</div>
              </div>
              {fileUploadError && <div className="statement-email-error">{fileUploadError}</div>}
            </>
          ) : (
            <div className="upload-success">
              <div className="upload-success-icon">&#10003;</div>
              <div className="upload-success-title">Statement received</div>
              <div className="upload-success-body">
                {fileName ? `${fileName} is queued. ` : ""}
                We&apos;re building full statement analysis and will send your personalised
                report to {statementEmail} the moment it&apos;s ready.
              </div>
              <a href="#waitlist" className="consult-btn" style={{ marginTop: "20px" }}>
                Join Waitlist -&gt;
              </a>
            </div>
          )}
        </div>

        <div className="statement-right reveal">
          <div className="consult-card">
            <div className="consult-eyebrow">Free - 30 minutes</div>
            <div className="consult-title">Book a card strategy session</div>
            <p className="consult-body">
              Talk to a ClearFin expert. We&apos;ll review your spending profile, current
              card lineup, and build you a personalised card strategy - completely free.
            </p>
            <div className="consult-items">
              <div className="consult-item">Personalised card stack recommendation</div>
              <div className="consult-item">Annual fee vs. rewards analysis</div>
              <div className="consult-item">Welcome bonus timing strategy</div>
              <div className="consult-disclaimer">
                <strong>* This is not financial advice. Educational information only.</strong>
              </div>
            </div>

            <a
              href="https://calendly.com/simran-clearfin/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="consult-btn"
            >
              Schedule Free Session -&gt;
            </a>

            <div
              style={{
                marginTop: "20px",
                fontFamily: "var(--font-jetbrains)",
                fontSize: "9px",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--ink-mute)",
              }}
            >
              No obligations - Free for early users
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider-bottom" />
    </section>
  );
}
