/* eslint-disable @next/next/no-html-link-for-pages -- Recovery links deliberately reload without depending on a possibly failed client router. */
import styles from "./RecoveryPage.module.css";

export default function RecoveryPage({ missing = false, retry }: { missing?: boolean; retry?: () => void }) {
  return (
    <main className={styles.page}>
      <a className={styles.brand} href="/" aria-label="ClearFin home">Clear<span>Fin</span></a>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>{missing ? "404 · PAGE NOT FOUND" : "LET'S TRY THAT AGAIN"}</p>
        <h1>{missing ? "This page isn't here." : "We couldn't load this page."}</h1>
        <p>{missing ? "The link may be out of date, or the address may have a typo. You can still explore ClearFin below." : "Something interrupted the page. Try again, or use one of the links below to keep exploring."}</p>
        <div className={styles.actions}>
          {retry && <button type="button" onClick={retry}>Try again</button>}
          <a href="/">Go to homepage</a>
          <a href="/credit-cards">Browse credit cards</a>
          <a href="/credit-card-calculator-canada">Open calculator</a>
        </div>
        <p className={styles.help}>Still stuck? <a href="/contact">Contact ClearFin</a>.</p>
      </div>
    </main>
  );
}
