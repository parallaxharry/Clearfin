/** Decorative only: a composed background with one short entrance. */
export default function WaitlistScene() {
  return (
    <div className="wait-scene" aria-hidden="true">
      <span className="wait-orb wait-orb-one" />
      <span className="wait-orb wait-orb-two" />
      <span className="wait-glass-card wait-glass-card-one"><i /><i /><i /></span>
      <span className="wait-glass-card wait-glass-card-two"><i /><i /><i /></span>
    </div>
  );
}
