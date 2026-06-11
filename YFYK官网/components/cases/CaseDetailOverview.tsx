import Link from "next/link";
import { CaseMarkdown } from "@/components/cases/CaseMarkdown";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CaseCenterCard } from "@/components/ui/CaseCenterCard";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import type { CaseCenterItem } from "@/lib/content/cases-center";
import type { CaseDetailView } from "@/lib/content/case-detail";
import { siteConfig } from "@/lib/content/home";

interface CaseDetailOverviewProps {
  detail: CaseDetailView;
  relatedCases: CaseCenterItem[];
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="cd-section-heading">
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
    </div>
  );
}

function ProseSection({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="cd-prose">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function CaseDetailOverview({ detail, relatedCases }: CaseDetailOverviewProps) {
  const url = `${siteConfig.siteUrl}/cases/${detail.slug}`;
  const hasMetrics = detail.metrics.length > 0;
  const hasContent = detail.content.trim().length > 0;

  return (
    <>
      <SiteHeader />
      <SchemaInjector
        id={`schema-case-detail-${detail.slug}`}
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${url}#article`,
            headline: detail.title,
            description: detail.summary,
            articleSection: detail.category,
            about: [detail.category, detail.industry],
            dateModified: siteConfig.dateModified,
            version: siteConfig.version,
            inLanguage: "zh-CN",
          },
        ]}
      />
      <main className="cd-page">
        <section className="cd-hero">
          <div className="cd-hero-bg" aria-hidden="true" />
          <div className="shell cd-hero-inner">
            <div className="cd-hero-copy">
              <nav className="cd-breadcrumb" aria-label="面包屑">
                <Link href="/">首页</Link>
                <span>/</span>
                <Link href="/cases">案例中心</Link>
                <span>/</span>
                <b>{detail.displayName}</b>
              </nav>
              <div className="cd-hero-tags">
                <span>{detail.category}</span>
                <span>{detail.industry}</span>
              </div>
              <h1>{detail.title}</h1>
              <p>{detail.summary}</p>
            </div>
            {detail.coverImage ? (
              <figure className="cd-hero-media">
                <img src={detail.coverImage} alt={detail.title} />
              </figure>
            ) : (
              <div className="cd-hero-media is-placeholder" aria-hidden="true" />
            )}
          </div>
        </section>

        {detail.challenge || detail.solution || detail.result ? (
          <section className="cd-band">
            <div className="shell">
              <div className="cd-overview-grid">
                {detail.challenge ? (
                  <article className="cd-overview-card">
                    <SectionHeading eyebrow="CHALLENGE" title="项目挑战" />
                    <ProseSection text={detail.challenge} />
                  </article>
                ) : null}
                {detail.solution ? (
                  <article className="cd-overview-card">
                    <SectionHeading eyebrow="SOLUTION" title="解决方案" />
                    <ProseSection text={detail.solution} />
                  </article>
                ) : null}
                {detail.result ? (
                  <article className="cd-overview-card">
                    <SectionHeading eyebrow="RESULT" title="项目成果" />
                    <ProseSection text={detail.result} />
                  </article>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {hasMetrics ? (
          <section className="cd-band is-alt">
            <div className="shell">
              <SectionHeading eyebrow="METRICS" title="指标数据" />
              <div className="cd-metrics-grid">
                {detail.metrics.map((metric) => (
                  <article className="cd-metric-card" key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {hasContent ? (
          <section className="cd-band">
            <div className="shell">
              <SectionHeading eyebrow="IMPLEMENTATION" title="项目实施过程" />
              <CaseMarkdown markdown={detail.content} />
            </div>
          </section>
        ) : null}

        {relatedCases.length > 0 ? (
          <section className="cd-band is-alt">
            <div className="shell">
              <SectionHeading eyebrow="MORE CASES" title="更多案例" />
              <p className="cd-related-lead">同分类项目实践，供您继续了解相关交付路径。</p>
              <div className="cd-related-grid">
                {relatedCases.map((item) => (
                  <CaseCenterCard item={item} key={item.slug} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <SubpageFinalCta
          eyebrow="START TODAY"
          title="希望获得类似成果？"
          description="从一次 GEO 策略沟通开始，评估您的官网在 AI 搜索时代的知识源建设路径。"
          sourceModule="case-detail-cta"
          primaryButton={{ label: "预约咨询", href: "/contact" }}
          secondaryButton={{ label: "查看更多案例", href: "/cases" }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
