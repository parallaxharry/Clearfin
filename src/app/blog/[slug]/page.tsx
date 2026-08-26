import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogPostArticle, {
  buildBlogPostMetadata,
} from "@/components/BlogPostArticle";
import { getPost, getPostPath, getPosts } from "@/lib/blog";

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
  return buildBlogPostMetadata(post, getPostPath(post));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const path = getPostPath(post);
  if (path !== `/blog/${slug}`) permanentRedirect(path);

  return <BlogPostArticle post={post} path={path} />;
}
