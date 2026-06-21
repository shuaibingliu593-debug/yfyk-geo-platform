import type { Metadata } from "next";
import "./news.css";
import { NewsOverview } from "@/components/news/NewsOverview";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getNews, mapNewsToArticles } from "@/lib/api";
import { newsMeta } from "@/lib/content/news";
import { getNewsPageSchemas } from "@/lib/schema/news";

export const metadata: Metadata = {
  title: newsMeta.title,
  description: newsMeta.description,
  alternates: {
    canonical: newsMeta.path,
    types: {
      "text/markdown": `${newsMeta.path}.md`,
    },
  },
  openGraph: {
    title: newsMeta.title,
    description: newsMeta.description,
    url: newsMeta.path,
    type: "website",
    locale: "zh_CN",
  },
};

/** 后台发布内容后约 60 秒内同步到官网 */
export const revalidate = 60;

export default async function NewsPage() {
  const apiNews = await getNews();
  const articles = mapNewsToArticles(apiNews);

  return (
    <>
      <SchemaInjector id="yfyk-news-page-schema" schemas={getNewsPageSchemas(articles)} />
      <MotionEnhancer />
      <ScrollToTop />
      <NewsOverview articles={articles} />
    </>
  );
}
