import Link from "next/link";
import type { Metadata } from "next";
import SeoLayout from "@/components/SeoLayout";
import { getPosts, formatPostDate } from "@/lib/blog";

// ISR: new blog_posts rows go live within ~5 min, no redeploy needed.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Canadian Credit Card Guides & Strategy | ClearFin",
  description:
    "Plain-math guides to Canadian credit cards: how points really work, cashback strategy, fees, and getting more back from the spending you already do.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <SeoLayout
      title="The ClearFin Blog"
      subtitle="Plain math, no hype — how Canadian credit cards actually pay you, and how to get more back from the spending you already do."
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
      ]}
      lastUpdated={formatPostDate(posts[0]?.publishedAt ?? new Date().toISOString())}
    >
      {posts.length === 0 ? (
        <p>No posts yet — check back soon.</p>
      ) : (
        <div className="blog-list">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
              <div className="blog-card-meta">
                <span>{formatPostDate(post.publishedAt)}</span>
                {post.tags.map((t) => (
                  <span className="blog-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="blog-card-title">{post.title}</h2>
              <p className="blog-card-desc">{post.description}</p>
              <span className="blog-card-more">Read the guide →</span>
            </Link>
          ))}
        </div>
      )}
    </SeoLayout>
  );
}
