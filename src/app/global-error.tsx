"use client";

import RecoveryPage from "@/components/RecoveryPage";
import "./fonts.css";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <html lang="en"><head><title>Let&apos;s try that again | ClearFin</title></head><body style={{ margin: 0 }}><RecoveryPage retry={unstable_retry} /></body></html>;
}
