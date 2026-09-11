import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SeoLayout from "@/components/SeoLayout";
import type { BlogPost } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";

const SITE_URL = "https://www.clearfin.ca";

export function buildBlogPostMetadata(
  post: BlogPost,
  path: string,
): Metadata {
  return {
    title: post.metaTitle ?? post.title + " | ClearFin Blog",
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: path,
      siteName: "ClearFin",
      locale: "en_CA",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImg
        ? [{ url: post.coverImg, alt: post.title, width: 1672, height: 941 }]
        : undefined,
    },
    twitter: post.coverImg
      ? {
          card: "summary_large_image",
          title: post.title,
          description: post.description,
          images: [post.coverImg],
        }
      : undefined,
  };
}

export default function BlogPostArticle({
  post,
  path,
}: {
  post: BlogPost;
  path: string;
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL + path,
    },
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ClearFin",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + "/logo.png",
      },
    },
    articleSection: post.tags,
    image: post.coverImg ? SITE_URL + post.coverImg : undefined,
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
          { label: post.title, href: path },
        ]}
        lastUpdated={formatPostDate(post.updatedAt)}
        eyebrow="ClearFin blog"
        heroImage={post.coverImg}
        heroImageAlt={post.title}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              const external = href?.startsWith("http");
              return (
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {post.bodyMd}
        </ReactMarkdown>
      </SeoLayout>
    </>
  );
}
