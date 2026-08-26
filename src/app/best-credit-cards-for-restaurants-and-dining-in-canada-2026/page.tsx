import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostArticle, {
  buildBlogPostMetadata,
} from "@/components/BlogPostArticle";
import { getPost, getPostPath } from "@/lib/blog";

const slug = "best-credit-cards-for-restaurants-and-dining-in-canada-2026";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getPost(slug);
  if (!post) return { title: "Post not found - ClearFin" };
  return buildBlogPostMetadata(post, getPostPath(post));
}

export default async function BestCreditCardsForRestaurantsPage() {
  const post = await getPost(slug);
  if (!post) notFound();
  const path = getPostPath(post);

  return <BlogPostArticle post={post} path={path} />;
}
