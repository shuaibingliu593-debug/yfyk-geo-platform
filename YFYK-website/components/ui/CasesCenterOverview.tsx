import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CaseCategoryFilter } from "@/components/ui/CaseCategoryFilter";
import { CaseCenterHeroStats } from "@/components/ui/CaseCenterHeroStats";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import { casesCenterHeroStats, type CaseCenterItem } from "@/lib/content/cases-center";
import { siteConfig } from "@/lib/content/home";

const version = siteConfig.version;

interface CasesCenterOverviewProps {
  cases: CaseCenterItem[];
}

export function CasesCenterOverview({ cases }: CasesCenterOverviewProps) {
  return (
    <>
      <SiteHeader />
      <main className="cc-page">
        <AISection
          id="cases-hero"
          summary="从 GEO原生建站、老网站AI友好度升级到企业知识库工程，通过真实项目展示企业如何提升 AI 可见度、建立知识资产并获得长期增长。"
          version={version}
        >
          <section className="cc-hero">
            <div className="cc-hero-bg" aria-hidden="true" />
            <div className="shell cc-hero-inner">
              <div className="cc-hero-copy">
                <p className="eyebrow light">
                  <span /> CASE STUDIES
                </p>
                <h1>客户实践与项目案例</h1>
                <p>
                  从 GEO原生建站、老网站AI友好度升级到企业知识库工程，通过真实项目展示企业如何提升
                  AI 可见度、建立知识资产并获得长期增长。
                </p>
              </div>
            </div>
            <div className="shell cc-hero-stats-wrap">
              <CaseCenterHeroStats stats={casesCenterHeroStats} />
            </div>
          </section>
        </AISection>

        <AISection
          id="cases-list"
          summary="按服务类型查看 GEO原生建站、网站AI改造与企业知识库项目实践案例。"
          version={version}
        >
          <section className="cc-list-band">
            <div className="shell">
              <div className="cc-list-head" data-reveal>
                <div>
                  <p className="eyebrow">
                    <span /> BY SERVICE TYPE
                  </p>
                  <h2>按服务类型查看案例</h2>
                </div>
                <p>选择不同服务类型，查看对应项目实践路径。</p>
              </div>
              <CaseCategoryFilter cases={cases} />
            </div>
          </section>
        </AISection>

        <AISection
          id="cases-cta"
          summary="获取专属 GEO 方案，评估您的官网在 AI 搜索时代的增长空间。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="START TODAY"
            title="让您的企业成为 AI 推荐的答案之一"
            description="获取专属 GEO 方案，评估您的官网在 AI 搜索时代的增长空间。"
            primaryButton={{ label: "预约咨询", href: "/contact" }}
            secondaryButton={{ label: "获取方案", href: "/contact" }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
