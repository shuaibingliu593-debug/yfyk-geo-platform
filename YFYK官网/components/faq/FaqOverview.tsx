import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FaqBrowseSection } from "@/components/faq/FaqBrowseSection";
import { FaqContactSection } from "@/components/faq/FaqContactSection";
import { FaqHeroStack } from "@/components/faq/FaqHeroStack";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import { faqCategoryLabels, faqHeroTags, type FaqItem } from "@/lib/content/faq";
import { siteConfig } from "@/lib/content/home";

interface FaqOverviewProps {
  faqItems: FaqItem[];
}

export function FaqOverview({ faqItems }: FaqOverviewProps) {
  const version = siteConfig.version;
  const heroStackCards = faqItems.slice(0, 3).map((item) => ({
    label: faqCategoryLabels[item.category],
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      <SiteHeader />
      <main className="faq-page">
        <AISection
          id="faq-hero"
          summary="整理 GEO、AI搜索、企业知识库与官网建设过程中最常见的问题与答案。"
          version={version}
        >
          <section className="faq-hero">
            <div className="faq-hero-bg" aria-hidden="true" />
            <div className="shell faq-hero-inner">
              <div className="faq-hero-copy">
                <p className="eyebrow light">
                  <span /> FAQ CENTER
                </p>
                <h1>常见问题 FAQ</h1>
                <p>
                  整理 GEO、AI搜索、企业知识库与官网建设过程中最常见的问题与答案，帮助企业快速理解
                  AI 时代的内容建设逻辑。
                </p>
                <div className="faq-hero-tags">
                  {faqHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              {heroStackCards.length > 0 ? <FaqHeroStack cards={heroStackCards} /> : null}
            </div>
          </section>
        </AISection>

        <AISection
          id="faq-browse"
          summary="按主题分类浏览 GEO、AI搜索与企业知识库相关标准答案。"
          version={version}
        >
          {faqItems.length === 0 ? (
            <section className="faq-band faq-browse-band is-soft" id="faq-list">
              <div className="shell">
                <div className="faq-empty" role="status">
                  <p>
                    暂未加载到 FAQ 内容。请确认后台 api-server 已启动（默认端口 3001），并已执行{" "}
                    <code>npm run prisma:seed</code> 导入数据后刷新本页。
                  </p>
                  <p>官网 FAQ 地址：<code>http://localhost:3002/faq</code>（非后台 3000 端口）。</p>
                </div>
              </div>
            </section>
          ) : (
            <FaqBrowseSection items={faqItems} />
          )}
        </AISection>

        <AISection
          id="faq-contact"
          summary="预约免费咨询，获取 GEO 方案建议、网站诊断与企业知识库规划支持。"
          version={version}
        >
          <FaqContactSection />
        </AISection>

        <AISection
          id="faq-cta"
          summary="通过 GEO、FAQ体系与知识资产建设，提升企业在 AI 搜索时代的可见度与影响力。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="STANDARD ANSWERS"
            title="让企业内容成为 AI 的标准答案"
            description="通过 GEO、FAQ体系与知识资产建设，提升企业在 AI 搜索时代的可见度与影响力。"
            sourceModule="faq-cta"
            primaryButton={{ label: "咨询 GEO 方案", openContactModal: true }}
            secondaryButton={{ label: "预约免费诊断", openContactModal: true }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
