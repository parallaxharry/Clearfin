"use client";

import type { CSSProperties, ReactNode } from "react";

type ScrollToSectionButtonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  targetId: string;
};

export default function ScrollToSectionButton({
  children,
  className,
  style,
  targetId,
}: ScrollToSectionButtonProps) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {children}
    </button>
  );
}
