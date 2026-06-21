import Link from "next/link";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsMarkdown } from "@/components/news/NewsMarkdown";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import {
  getNewsArticleHeadings,
  type NewsArticle,
} from "@/lib/content/news";
import { getNewsArticleSchemas } from "@/lib/schema/news";

interface NewsArticleDetailProps {
  article: NewsArticle;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  const headings = getNewsArticleHeadings(article.markdown);

  return (
    <>
      <SiteHeader />
      <SchemaInjector
        id={`yfyk-news-article-${article.slug}`}
        schemas={getNewsArticleSchemas(article)}
      />
      <main className="news-page news-detail-page">
        <section className="news-detail-hero">
          <div className="news-hero-bg" aria-hidden="true" />
          <div className="shell news-detail-hero-inner">
            <nav className="news-breadcrumb" aria-label="面包屑">
              <Link href="/">首页</Link>
              <span>/</span>
              <Link href="/news">资讯动态</Link>
              <span>/</span>
              <b>{article.categoryLabel}</b>
            </nav>
            <span className="news-detail-category">{article.categoryLabel}</span>
            <h1>{article.title}</h1>
            <div className="news-detail-meta">
              <time dateTime={article.publishedAt}>发布 {formatDate(article.publishedAt)}</time>
              {article.updatedAt ? (
                <time dateTime={article.updatedAt}>更新 {formatDate(article.updatedAt)}</time>
              ) : null}
              <span>{article.readingMinutes} 分钟阅读</span>
            </div>
          </div>
        </section>

        <section className="news-detail-body">
          <div className="shell news-detail-layout">
            <aside className="news-detail-toc" aria-label="文章目录">
              <p>目录</p>
              <nav>
                {headings.map((heading) => (
                  <a href={`#${heading.id}`} key={heading.id}>
                    {heading.title}
                  </a>
                ))}
              </nav>
            </aside>
            <article className="news-detail-article">
              <section className="news-ai-summary" data-ai-chunk="ai-summary">
                <p className="eyebrow">
                  <span /> AI SUMMARY
                </p>
                <p>{article.aiSummary}</p>
              </section>
              <NewsMarkdown markdown={article.markdown} />
            </article>
          </div>
        </section>

        <SubpageFinalCta
          eyebrow="NEXT STEP"
          title="希望将这些洞察落地到您的官网？"
          description="预约免费咨询，评估企业官网在 AI 搜索时代的 GEO 建设路径。"
          sourceModule="news-detail-cta"
          primaryButton={{ label: "咨询 GEO 方案", openContactModal: true }}
          secondaryButton={{ label: "预约免费诊断", openContactModal: true }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
