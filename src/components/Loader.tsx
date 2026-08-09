"use client";

import { useEffect, useState } from "react";
import ClearFinWordmark from "@/components/ClearFinWordmark";

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`loader${done ? " done" : ""}`}>
      <ClearFinWordmark className="loader-wordmark" />
      <div className="loader-text">CLEARFIN — INITIALIZING</div>
      <div className="loader-bar" />
    </div>
  );
}
