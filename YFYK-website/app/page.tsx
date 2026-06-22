import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { CaseGallery } from "@/components/ui/CaseGallery";
import { GeoServiceFlow } from "@/components/ui/GeoServiceFlow";
import { BusinessTechOutline } from "@/components/ui/BusinessTechOutline";
import { GeoPracticeStats } from "@/components/ui/GeoPracticeStats";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { getHomePageSchemas } from "@/lib/schema/home";
import { homeContent, geoPracticeStats, siteConfig } from "@/lib/content/home";
import {
  getHomeRecommendedCases,
  mapApiCasesToHomeCases,
} from "@/lib/api";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/page.md",
    },
  },
};

const section = (id: string) => {
  const value = homeContent.sections.find((item) => item.id === id);
  if (!value) throw new Error(`Missing home section: ${id}`);
  return value;
};
const aiSummary = (id: string) => section(id).summary;

export default async function Home() {
  const { data: apiCases, loadError: casesLoadError } = await getHomeRecommendedCases().then(
    (data) => ({ data, loadError: false }),
    (error) => {
      console.error("[home] failed to load recommended cases:", error);
      return { data: [], loadError: true };
    },
  );
  const featuredCases = mapApiCasesToHomeCases(apiCases);

  return (
    <>
      <link rel="preload" href="/videos/hero-banner-8s.mp4" as="fetch" type="video/mp4" fetchPriority="high" />
      <link rel="preload" href="/videos/hero-banner-5s.mp4" as="fetch" type="video/mp4" />
      <SiteHeader />
      <SchemaInjector id="yfyk-home-page-schema" schemas={getHomePageSchemas()} />
      <MotionEnhancer />
      <main>
        <section className="hero" id="hero" data-ai-chunk="hero" data-ai-summary={aiSummary("hero")} data-version={siteConfig.version}>
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="shell hero-stage">
            <HeroCarousel hotline={siteConfig.hotline} />
          </div>
        </section>
        <section className="geo-practice-band" id="geo-practice" data-ai-chunk="geo-practice" data-ai-summary={aiSummary("geo-practice")} data-reveal>
          <div className="shell geo-practice-inner">
            <p>企业级 GEO 建设实践</p>
            <GeoPracticeStats stats={geoPracticeStats} />
          </div>
        </section>

        <section className="business-outline-section section-pad" id="business-tech-outline" data-ai-chunk="business-tech-outline" data-ai-summary={aiSummary("business-tech-outline")} data-reveal>
          <div className="shell">
            <BusinessTechOutline />
          </div>
        </section>

        <section className="cases section-pad" id="featured-cases" data-ai-chunk="featured-cases" data-ai-summary={aiSummary("featured-cases")} data-reveal>
          <div className="shell">
            <div className="section-heading split">
              <div><p className="eyebrow"><span /> FEATURED CASES</p><h2>{section("featured-cases").title}</h2></div>
              <p>以可验证的企业事实为基础，围绕不同业务场景建立清晰、可信、可持续运营的 AI 知识入口。</p>
            </div>
            {casesLoadError ? (
              <p className="dynamic-content-unavailable" role="status">案例内容暂时不可用，请稍后刷新。</p>
            ) : (
              <CaseGallery cases={featuredCases} compact revealOnHover />
            )}
            <div className="case-more"><Link className="button" href="/cases">查看更多案例 <Icon name="arrow" size={17} /></Link></div>
          </div>
        </section>

        <section className="geo-service-flow-section section-pad" id="geo-service-flow" data-ai-chunk="geo-service-flow" data-ai-summary={aiSummary("geo-service-flow")} data-reveal>
          <GeoServiceFlow summary={aiSummary("geo-service-flow") ?? ""} />
        </section>

        <section className="contact section-pad" id="contact" data-ai-chunk="contact" data-ai-summary={aiSummary("contact")} data-reveal>
          <div className="shell contact-box">
            <div><p className="eyebrow light"><span /> START TODAY</p><h2>让您的官网，成为<br />AI 优先引用的答案</h2></div>
            <div className="contact-side">
              <p>从一次官网 AI 友好度诊断开始，建立企业在生成式搜索时代的官方知识源。</p>
              <a className="button button-white" href={`tel:${siteConfig.hotline}`}>拨打 {siteConfig.hotline} <Icon name="arrow" size={18} /></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
