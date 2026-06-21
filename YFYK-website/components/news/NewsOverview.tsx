import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsBrowseSection } from "@/components/news/NewsBrowseSection";
import { NewsHeroStack } from "@/components/news/NewsHeroStack";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import { newsHeroTags, type NewsArticle } from "@/lib/content/news";
import { siteConfig } from "@/lib/content/home";

interface NewsOverviewProps {
  articles: NewsArticle[];
}

export function NewsOverview({ articles }: NewsOverviewProps) {
  const version = siteConfig.version;
  const heroStackCards = articles.slice(0, 3).map((article) => ({
    categoryLabel: article.categoryLabel,
    title: article.title,
    slug: article.slug,
  }));

  return (
    <>
      <SiteHeader />
      <main className="news-page">
        <AISection
          id="news-hero"
          summary="关注 GEO、AI搜索、企业知识库与生成式AI的发展趋势，分享行业观察、实践经验与项目洞察。"
          version={version}
        >
          <section className="news-hero">
            <div className="news-hero-bg" aria-hidden="true" />
            <div className="shell news-hero-inner">
              <div className="news-hero-copy">
                <p className="eyebrow light">
                  <span /> INSIGHTS
                </p>
                <h1>资讯动态</h1>
                <p>
                  关注 GEO、AI搜索、企业知识库与生成式AI的发展趋势，分享行业观察、实践经验与项目洞察。
                </p>
                <div className="news-hero-tags">
                  {newsHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              {heroStackCards.length > 0 ? <NewsHeroStack cards={heroStackCards} /> : null}
            </div>
          </section>
        </AISection>

        <AISection
          id="news-browse"
          summary="按 GEO洞察、AI搜索、企业知识库与公司动态浏览资讯内容。"
          version={version}
        >
          <NewsBrowseSection articles={articles} />
        </AISection>

        <AISection
          id="news-cta"
          summary="获取更多 GEO 与 AI 搜索实践洞察，了解企业如何在 AI 时代建立长期数字资产。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="KEEP LEARNING"
            title="获取更多 GEO 与 AI 搜索实践洞察"
            description="了解企业如何在 AI 时代建立长期数字资产，提升 AI 可见度与内容价值。"
            primaryButton={{ label: "咨询 GEO 方案", openContactModal: true }}
            secondaryButton={{ label: "预约免费诊断", openContactModal: true }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
