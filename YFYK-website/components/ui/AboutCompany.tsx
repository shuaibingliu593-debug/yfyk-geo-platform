import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon, type IconName } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import {
  aboutCompanyIntroParagraphs,
  aboutCompanyStats,
  aboutCompanyTimeline,
  aboutCompanyValues,
  aboutCompanyVisionMission,
} from "@/lib/content/about-company";
import type { GeoPageContent } from "@/lib/content/types";

const VALUE_ICONS: IconName[] = ["chart", "pulse", "code", "shield"];

function SectionHead({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className={`about-section-head${light ? " is-light" : ""}`}>
      <p className={`eyebrow${light ? " light" : ""}`}><span /> {eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export function AboutCompany({ page }: { page: GeoPageContent }) {
  return (
    <>
      <SiteHeader />
      <main className="geo-page about-company-page">
        <AISection id="company-profile" summary="优服优科从搜索营销服务商转型为GEO与企业AI知识库建设服务商。" version={page.metadata.version}>
          <div className="about-hero" id="top">
            <div className="about-hero-media" aria-hidden="true" />
            <div className="about-hero-overlay" aria-hidden="true" />
            <div className="about-hero-deco" aria-hidden="true">YFYK</div>
            <div className="about-data-lines" aria-hidden="true" />
            <div className="shell about-hero-copy">
              <p className="eyebrow light"><span /> YFYK COMPANY</p>
              <h1>关于优服优科</h1>
              <p className="about-hero-lead">从搜索优化到AI搜索</p>
              <div className="about-hero-intro">
                {aboutCompanyIntroParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 12)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </AISection>

        <AISection id="data-trust-summary" summary="已服务超过500个品牌，AI搜索结果展现率提升6倍，客户转化成本降低42%。" version={page.metadata.version}>
          <section className="about-stats">
            <div className="shell">
              <div className="about-stat-row">
                {aboutCompanyStats.map((item) => (
                  <p key={item.label}><strong>{item.value}</strong><span>{item.label}</span></p>
                ))}
              </div>
            </div>
          </section>
        </AISection>

        <AISection id="development-history" summary="优服优科经历SEO、SMO和智能GEO三个阶段。" version={page.metadata.version}>
          <section className="about-history">
            <div className="about-history-media" aria-hidden="true" />
            <div className="about-history-overlay" aria-hidden="true" />
            <div className="about-history-pattern" aria-hidden="true" />
            <div className="shell">
              <SectionHead eyebrow="HISTORY" title="发展历程" light />
              <div className="about-timeline">
                {aboutCompanyTimeline.map((item, index) => (
                  <article key={item.era}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.era}</h3>
                    <strong>{item.years}</strong>
                    <dl>
                      <dt>核心能力</dt>
                      <dd>{item.capability}</dd>
                      <dt>关键成果</dt>
                      <dd>{item.result}</dd>
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </AISection>

        <AISection id="vision-mission-values" summary="愿景是成为AI搜索时代可信赖的数字资产建设伙伴，使命是帮助企业从被浏览转化为被AI信任。" version={page.metadata.version}>
          <section className="about-vision">
            <div className="shell">
              <SectionHead eyebrow="VISION & MISSION" title="愿景与使命" />
              <div className="about-vision-grid">
                {aboutCompanyVisionMission.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
              <div className="about-values-grid">
                {aboutCompanyValues.map((item, index) => (
                  <article key={item}>
                    <div className="about-value-icon">
                      <Icon name={VALUE_ICONS[index]} size={22} />
                    </div>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
