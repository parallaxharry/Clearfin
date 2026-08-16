import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SeoLayout from "@/components/SeoLayout";
import { getPost, getPosts, formatPostDate } from "@/lib/blog";

// ISR: edits to blog_posts go live within ~5 min; new slugs render on first visit.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found - ClearFin" };

  return {
    title: `${post.title} | ClearFin Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImg ? [{ url: post.coverImg, alt: post.title }] : undefined,
    },
    twitter: post.coverImg
      ? { card: "summary_large_image", title: post.title, description: post.description, images: [post.coverImg] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author, url: "https://www.clearfin.ca" },
    publisher: { "@type": "Organization", name: "ClearFin", url: "https://www.clearfin.ca" },
    mainEntityOfPage: `https://www.clearfin.ca/blog/${post.slug}`,
    image: post.coverImg ? `https://www.clearfin.ca${post.coverImg}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SeoLayout
        title={post.title}
        subtitle={post.description}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        lastUpdated={formatPostDate(post.updatedAt)}
        eyebrow="ClearFin blog"
        heroImage={post.coverImg}
        heroImageAlt={post.title}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.bodyMd}</ReactMarkdown>
      </SeoLayout>
    </>
  );
}
