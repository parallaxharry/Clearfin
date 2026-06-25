import Image from "next/image";
import Link from "next/link";

/**
 * The single canonical ClearFin brand lockup: gold CF tile + "Clear" with an
 * italic serif "Fin" and the pulsing accent dot. Used in every page header so
 * the logo + name are identical site-wide. `href` lets the home nav keep its
 * in-page anchor; everywhere else it links back to "/".
 */
export default function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`logo${className ? ` ${className}` : ""}`}
      aria-label="ClearFin home"
    >
      <div className="logo-mark">
        <Image src="/logo.png" alt="ClearFin" width={40} height={40} priority />
      </div>
      <div className="logo-word">
        <span className="clear">Clear</span>
        <span className="fin">Fin</span>
      </div>
    </Link>
  );
}
