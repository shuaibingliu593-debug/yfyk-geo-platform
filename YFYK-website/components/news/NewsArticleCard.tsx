import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import type { NewsArticle } from "@/lib/content/news";

interface NewsArticleCardProps {
  article: NewsArticle;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  return (
    <Link className="news-article-card" href={`/news/${article.slug}`}>
      <span className="news-article-category">{article.categoryLabel}</span>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <div className="news-article-meta">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <span>{article.readingMinutes} 分钟</span>
      </div>
      <span className="news-article-link">
        阅读全文 <Icon name="arrow" size={16} />
      </span>
    </Link>
  );
}
