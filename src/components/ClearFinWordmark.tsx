type ClearFinWordmarkProps = {
  className?: string;
};

export default function ClearFinWordmark({ className = "" }: ClearFinWordmarkProps) {
  return (
    <span className={`clearfin-wordmark ${className}`.trim()}>
      <span className="clear">Clear</span>
      <span className="fin">Fin</span>
      <sup className="logo-trademark" aria-label="Trademark">™</sup>
    </span>
  );
}
