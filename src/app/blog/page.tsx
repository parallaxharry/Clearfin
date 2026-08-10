import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { getPosts, formatPostDate } from "@/lib/blog";

// ISR: new blog_posts rows go live within ~5 min, no redeploy needed.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Canadian Credit Card Guides & Strategy | ClearFin",
  description:
    "Plain-math guides to Canadian credit cards: how points really work, cashback strategy, fees, and getting more back from the spending you already do.",
  alternates: { canonical: "/blog" },
};

/** Rough read time from the markdown body, at an unhurried 200 wpm. */
function readMinutes(bodyMd: string): number {
  const words = bodyMd.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogIndex() {
  const posts = await getPosts();
  const topicCount = new Set(posts.flatMap((post) => post.tags)).size;

  return (
    <>
      <Nav />
      <main className="catalog-page blog-index">
        <nav className="blog-index-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Blog</span>
        </nav>

        <header className="catalog-hero">
          <div className="catalog-eyebrow">The ClearFin blog</div>
          <h1>Credit card guides<br /><span>without the hype.</span></h1>
          <p>Plain math on how Canadian credit cards actually pay you — how points convert into real dollars, when an annual fee earns its keep, and how to get more back from the spending you already do.</p>
          <div className="catalog-summary">
            <div><strong>{posts.length}</strong><span>{posts.length === 1 ? "guide published" : "guides published"}</span></div>
            <div><strong>{topicCount}</strong><span>topics covered</span></div>
            <div><strong>Independent</strong><span>no sponsored posts</span></div>
          </div>
        </header>

        <section className="catalog-list" aria-labelledby="blog-index-title">
          <div className="catalog-list-head">
            <div><span>Canadian credit card guides</span><h2 id="blog-index-title">Browse every guide</h2></div>
            <Link href="/credit-card-calculator-canada">Find my best card →</Link>
          </div>

          {posts.length === 0 ? (
            <p className="blog-index-empty">No guides published yet — check back soon.</p>
          ) : (
            <div className="catalog-grid">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} className="catalog-card" key={post.slug}>
                  <div className="catalog-card-art blog-index-art">
                    {post.coverImg ? (
                      <Image src={post.coverImg} alt="" fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 380px" style={{ objectFit: "cover" }} />
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23V5.5Z" />
                        </svg>
                        <span>{post.tags[0] ?? "Guide"}</span>
                      </>
                    )}
                  </div>
                  <div className="catalog-card-copy">
                    <span>{formatPostDate(post.publishedAt)}</span>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <div>
                      <small>Read time</small>
                      <strong>{readMinutes(post.bodyMd)} min</strong>
                    </div>
                    <em>Read the guide <b>→</b></em>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
