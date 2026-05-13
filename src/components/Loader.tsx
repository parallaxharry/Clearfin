"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`loader${done ? " done" : ""}`}>
      <Image
        src="/logo.png"
        alt="ClearFin"
        width={72}
        height={72}
        className="loader-mark"
        priority
      />
      <div className="loader-text">CLEARFIN — INITIALIZING</div>
      <div className="loader-bar" />
    </div>
  );
}
