import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../news.css";
import { NewsArticleDetail } from "@/components/news/NewsArticleDetail";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getNewsBySlug, mapNewsToArticle } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

const resolveSlug = async ({ params }: Props) => (await params).slug;

/** 后台发布内容后约 60 秒内同步到官网 */
export const revalidate = 60;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const slug = await resolveSlug(props);
  const apiNews = await getNewsBySlug(slug);
  if (!apiNews) return {};

  const article = mapNewsToArticle(apiNews);
  return {
    title: `${article.title}｜资讯动态｜YFYK`,
    description: article.excerpt,
    alternates: {
      canonical: `/news/${article.slug}`,
      types: {
        "text/markdown": `/news/${article.slug}.md`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/news/${article.slug}`,
      type: "article",
      locale: "zh_CN",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
    },
  };
}

export default async function NewsArticlePage(props: Props) {
  const slug = await resolveSlug(props);
  const apiNews = await getNewsBySlug(slug);
  if (!apiNews) notFound();

  const article = mapNewsToArticle(apiNews);
  return (
    <>
      <MotionEnhancer />
      <ScrollToTop />
      <NewsArticleDetail article={article} />
    </>
  );
}
