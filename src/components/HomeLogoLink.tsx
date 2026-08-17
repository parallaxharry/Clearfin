"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HomeLogoLinkProps {
  children: React.ReactNode;
  className: string;
  onActivate?: () => void;
}

/**
 * The shared wordmark link. Next already scrolls new page navigations to the
 * top, but clicking "/" while already on the homepage is otherwise a no-op.
 */
export default function HomeLogoLink({
  children,
  className,
  onActivate,
}: HomeLogoLinkProps) {
  const pathname = usePathname();

  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onActivate?.();
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      href="/"
      className={className}
      aria-label="ClearFin home"
      onClick={goHome}
    >
      {children}
    </Link>
  );
}
