import type { Metadata } from "next";
import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { notFound } from "next/navigation";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { caseStudies, getCaseStudy } from "@/lib/content/cases";
import { getGeoPageTitle } from "@/lib/content/geo-pages";
import { siteConfig } from "@/lib/content/home";

type Props = { params: Promise<{ slug: string }> };
const pendingLabel = "客户授权后公开 / 占位内容";
const resolve = async ({ params }: Props) => getCaseStudy((await params).slug);

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const caseStudy = await resolve(props);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.title} | 标杆案例库 | 优服优科`,
    description: caseStudy.description,
    alternates: { canonical: caseStudy.href, types: { "text/markdown": `${caseStudy.href}.md` } },
  };
}

function EvidencePending({ title, description }: { title: string; description: string }) {
  return <div className="case-evidence-pending"><span>AUTHORIZATION PENDING</span><h3>{title}</h3><p>{description}</p><b>{pendingLabel}</b></div>;
}

function PlaceholderCitationGrid() {
  return (
    <div className="case-citation-grid">
      {["占位AI平台01", "占位AI平台02", "占位AI平台03"].map((platform) => (
        <figure className="case-citation-placeholder" key={platform}>
          <div><span /><i /><i /><i /></div>
          <figcaption>{platform} · 占位引用截图</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default async function CaseStudyPage(props: Props) {
  const caseStudy = await resolve(props);
  if (!caseStudy) notFound();
  const authorized = caseStudy.publicationStatus === "authorized";
  const url = `${siteConfig.siteUrl}${caseStudy.href}`;
  const visibleSections = [
    ["case-overview", "项目概览"],
    ["background-and-challenge", "背景与挑战"],
    ["case-solution", "我们的解决方案"],
    ["results-and-evidence", "成果与证据"],
    ["ai-citation-records", "AI引用实录"],
    ["client-testimonial", "客户证言"],
  ];
  return (
    <>
      <SiteHeader />
      <SchemaInjector id={`schema-case-${caseStudy.slug}`} schemas={[{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        name: caseStudy.title,
        description: caseStudy.description,
        url,
        isPartOf: { "@id": `${siteConfig.siteUrl}/solutions/cases#webpage` },
        about: { "@id": `${siteConfig.siteUrl}/#organization` },
        hasPart: visibleSections.map(([id, name]) => ({ "@type": "WebPageElement", "@id": `${url}#${id}`, name })),
        dateModified: siteConfig.dateModified,
        version: siteConfig.version,
        inLanguage: "zh-CN",
      }, {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: caseStudy.title,
        description: caseStudy.description,
        articleSection: caseStudy.industry,
        about: caseStudy.highlights,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
        dateModified: siteConfig.dateModified,
        version: siteConfig.version,
        inLanguage: "zh-CN",
      }]} />
      <ScrollToTop />
      <main className="case-detail-page">
        <section className="case-detail-hero">
          <div className="shell">
            <nav className="case-breadcrumb"><Link href="/">首页</Link><span>/</span><Link href="/cases/showcase">标杆案例库</Link><span>/</span><b>{caseStudy.title}</b></nav>
            <p className="eyebrow light"><span /> CASE STUDY</p>
            <div className="case-detail-hero-grid">
              <div><h1>{caseStudy.title}</h1><p>{caseStudy.description}</p></div>
              <aside><strong>PLACEHOLDER CASE</strong><p>当前使用占位图、XXX品牌名称、XXXX案例名称、占位介绍与占位数据展示页面效果。</p></aside>
            </div>
          </div>
        </section>
        <div className="shell case-detail-body">
          <section className="case-overview" id="case-overview" data-ai-chunk="case-overview">
            <div className="case-section-title"><p className="eyebrow"><span /> PROJECT OVERVIEW</p><h2>项目概览</h2></div>
            <div className="case-overview-grid">
              <article><small>客户</small><strong>{caseStudy.clientDisplayName}</strong></article>
              <article><small>行业</small><strong>{caseStudy.industry}</strong></article>
              <article><small>核心挑战</small><strong>{caseStudy.coreChallenge}</strong></article>
            </div>
            <div className="case-result-banner"><small>主要成果</small><strong>{caseStudy.outcomeSummary}</strong></div>
          </section>
          <section className="case-detail-section" id="background-and-challenge" data-ai-chunk="background-and-challenge">
            <div className="case-section-title"><p className="eyebrow"><span /> CHALLENGE</p><h2>背景与挑战</h2></div>
            <p>{caseStudy.background}</p>
          </section>
          <section className="case-detail-section" id="case-solution" data-ai-chunk="case-solution">
            <div className="case-section-title"><p className="eyebrow"><span /> SOLUTION</p><h2>我们的解决方案</h2><p>根据该项目场景组合产品与服务，展示定制化落地路径。</p></div>
            <div className="case-service-links">{caseStudy.relatedServicePaths.map((path, index) => <Link href={path} key={path}><span>0{index + 1}</span><strong>{getGeoPageTitle(path)}</strong><Icon name="arrow" size={16} /></Link>)}</div>
          </section>
          <section className="case-detail-section" id="results-and-evidence" data-ai-chunk="results-and-evidence">
            <div className="case-section-title"><p className="eyebrow"><span /> RESULTS</p><h2>成果与证据</h2></div>
            {caseStudy.metrics?.length ? <div className="case-metrics">{caseStudy.metrics.map((metric) => <article key={metric.label}><small>{metric.label}</small><strong>{metric.value}</strong>{metric.note && <p>{metric.note}</p>}</article>)}</div> : <EvidencePending title="关键指标与变化曲线" description="占位数据将在此处展示。" />}
            {caseStudy.trendData?.length ? <div className="case-trend" aria-label="占位数据变化曲线">{caseStudy.trendData.map((point) => <div key={point.label}><i style={{ height: `${Math.max(8, point.value)}%` }} /><span>{point.label}</span></div>)}</div> : null}
          </section>
          <section className="case-detail-section" id="ai-citation-records" data-ai-chunk="ai-citation-records">
            <div className="case-section-title"><p className="eyebrow"><span /> AI CITATIONS</p><h2>AI引用实录</h2></div>
            {authorized && caseStudy.aiCitationScreenshots?.length ? null : <PlaceholderCitationGrid />}
          </section>
          <section className="case-detail-section" id="client-testimonial" data-ai-chunk="client-testimonial">
            <div className="case-section-title"><p className="eyebrow"><span /> TESTIMONIAL</p><h2>客户证言</h2></div>
            {caseStudy.testimonial ? <blockquote className="case-testimonial"><p>“{caseStudy.testimonial.quote}”</p><footer><strong>{caseStudy.testimonial.name}</strong><span>{caseStudy.testimonial.role}</span></footer></blockquote> : <EvidencePending title="客户团队证言" description="占位介绍将在此处展示。" />}
          </section>
          <section className="case-detail-cta"><div><p className="eyebrow light"><span /> START WITH SCOPE</p><h2>从业务问题开始梳理您的落地路径</h2></div><ContactCtaAction className="button button-white" href="/contact">联系优服优科 <Icon name="arrow" size={17} /></ContactCtaAction></section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
