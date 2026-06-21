"use client";

import { useMemo, useState } from "react";
import { NewsArticleCard } from "@/components/news/NewsArticleCard";
import {
  filterNewsByCategory,
  newsCategories,
  type NewsArticle,
  type NewsCategory,
} from "@/lib/content/news";

interface NewsBrowseSectionProps {
  articles: NewsArticle[];
}

export function NewsBrowseSection({ articles }: NewsBrowseSectionProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("all");
  const filteredArticles = useMemo(
    () => filterNewsByCategory(articles, activeCategory),
    [articles, activeCategory],
  );

  return (
    <section className="news-browse-band" id="latest">
      <div className="shell news-browse-stack">
        <div className="news-tabs-scroll" role="tablist" aria-label="资讯分类">
          <div className="news-tabs">
            {newsCategories.map((category) => {
              const isActive = activeCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`news-tab${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="news-article-grid" role="tabpanel">
          {filteredArticles.length === 0 ? (
            <p className="news-empty" role="status">
              暂无已发布资讯，请稍后再来查看。
            </p>
          ) : (
            filteredArticles.map((article) => (
              <NewsArticleCard article={article} key={article.slug} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
