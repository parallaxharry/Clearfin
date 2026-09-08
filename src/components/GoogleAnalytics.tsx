"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncGoogleAnalytics } from "@/lib/googleAnalytics";
import { subscribeToConsent } from "@/lib/trackingConsent";

export default function GoogleAnalytics({ id }: { id: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const sync = () => syncGoogleAnalytics(id);
    sync();
    return subscribeToConsent(sync);
  }, [id, pathname]);
  return null;
}
