"use client";

import RecoveryPage from "@/components/RecoveryPage";

export default function ErrorPage({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <RecoveryPage retry={unstable_retry} />;
}
