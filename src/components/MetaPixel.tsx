"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncMetaPixel } from "@/lib/metaPixel";
import { subscribeToConsent } from "@/lib/trackingConsent";

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    syncMetaPixel();
    return subscribeToConsent(syncMetaPixel);
  }, [pathname]);

  // There is deliberately no unconditional noscript beacon: it would contact
  // Meta without a visitor being able to make an advertising consent choice.
  return null;
}
