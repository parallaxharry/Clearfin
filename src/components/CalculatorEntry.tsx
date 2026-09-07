"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InteractiveTool from "@/components/InteractiveTool";

function EntryFromUrl() {
  const direct = useSearchParams().get("start") === "1";
  return <InteractiveTool key={direct ? "direct" : "intro"} pageHeading startOpen={direct} />;
}

export default function CalculatorEntry() {
  return <Suspense fallback={<InteractiveTool pageHeading />}><EntryFromUrl /></Suspense>;
}
