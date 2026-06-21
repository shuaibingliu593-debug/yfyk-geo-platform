import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/lib/content/home";
import { caseLibraryCases, getCasesForList, type CaseLibraryCase, type CaseLibraryListPage } from "@/lib/content/case-library";

function LogoMark({ name }: { name: string }) {
  return <div className="case-library-logo" aria-label={`${name} logo占位`}>{name.slice(0, 2)}</div>;
}

function CaseCard({ item, featuredBadge = false }: { item: CaseLibraryCase; featuredBadge?: boolean }) {
  return (
    <Link className="case-library-card" href={`/cases/${item.slug}`}>
      <div className="case-library-card-top">
        <LogoMark name={item.clientName} />
        {(featuredBadge || item.isFeatured) ? <span>精选</span> : null}
      </div>
      <div className="case-library-card-chart" aria-hidden="true"><i /><i /><i /><i /></div>
      <h2>{item.shortTitle}</h2>
      <div className="case-library-tags">{item.listTags.map((tag) => <small key={tag}>{tag}</small>)}</div>
      <strong>{item.resultHighlight}</strong>
      <p>{item.resultSummary}</p>
      <b>查看案例 <Icon name="arrow" size={15} /></b>
    </Link>
  );
}

export function CaseLibraryList({ page }: { page: CaseLibraryListPage }) {
  const cases = getCasesForList(page);
  const url = `${siteConfig.siteUrl}/cases/${page.slug}`;
  return (
    <>
      <SiteHeader />
      <SchemaInjector id={`schema-case-list-${page.slug}`} schemas={[{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        name: page.heading,
        description: page.description,
        url,
        dateModified: siteConfig.dateModified,
        version: siteConfig.version,
        inLanguage: "zh-CN",
      }, {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${url}#cases`,
        name: page.heading,
        itemListElement: cases.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: `${siteConfig.siteUrl}/cases/${item.slug}`,
        })),
      }]} />
      <main className="case-library-page">
        <section className="case-library-hero">
          <div className="shell">
            <p className="eyebrow"><span /> CASE LIBRARY</p>
            <h1>{page.heading}</h1>
            <p>{page.heroLead}</p>
          </div>
        </section>
        <section className="case-library-section">
          <div className="shell">
            <div className="case-library-filterbar" aria-label="案例筛选">
              {page.filters.map((filter) => (
                <div className="case-library-filter" key={filter.label}>
                  <span>{filter.label}</span>
                  <div>{filter.options.map((option, index) => <button className={index === 0 ? "is-active" : ""} key={option} type="button">{option}</button>)}</div>
                </div>
              ))}
              <label className="case-library-sort">
                <span>排序</span>
                <select aria-label={page.sortLabel}>
                  <option>{page.sortLabel.replace(/^[^：]+：/, "")}</option>
                </select>
              </label>
            </div>
            <div className="case-library-grid">
              {cases.map((item) => <CaseCard featuredBadge={page.featuredOnly} item={item} key={item.slug} />)}
            </div>
            <div className="case-library-more"><button type="button">加载更多</button></div>
          </div>
        </section>
        <section className="case-library-cta">
          <div className="shell">
            <h2>{page.cta.title}</h2>
            <ContactCtaAction href={page.cta.href}>{page.cta.label} <Icon name="arrow" size={16} /></ContactCtaAction>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function CaseLibraryDetail({
  item,
  relatedCases = [],
}: {
  item: CaseLibraryCase;
  relatedCases?: CaseLibraryCase[];
}) {
  const related = relatedCases.length > 0 ? relatedCases : [];
  const url = `${siteConfig.siteUrl}/cases/${item.slug}`;
  const highlightMetrics = item.results.slice(0, 3);
  return (
    <>
      <SiteHeader />
      <SchemaInjector id={`schema-case-detail-${item.slug}`} schemas={[{
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: item.title,
        description: item.resultSummary,
        articleSection: item.serviceType,
        about: [item.serviceType, item.subService, item.industry],
        dateModified: siteConfig.dateModified,
        version: siteConfig.version,
        inLanguage: "zh-CN",
      }]} />
      <main className="case-library-page case-library-detail">
        <section className="case-detail-simple-hero">
          <div className="shell">
            <div className="case-detail-hero-grid">
              <div>
                <nav className="case-library-breadcrumb" aria-label="面包屑">
                  <Link href="/">首页</Link><span>/</span><Link href="/cases/showcase">标杆案例库</Link><span>/</span><b>{item.clientName}</b>
                </nav>
                <p className="eyebrow"><span /> CASE DETAIL</p><h1>{item.title}</h1><p>{item.resultSummary}</p>
              </div>
              <LogoMark name={item.clientName} />
            </div>
            <div className="case-detail-kpis">{highlightMetrics.map((metric) => <article key={metric.metric}><small>{metric.metric}</small><strong>{metric.change}</strong><span>{metric.after}</span></article>)}</div>
          </div>
        </section>
        <div className="shell case-detail-stack">
          <section className="case-detail-panel case-detail-background">
            <div><p className="eyebrow"><span /> BACKGROUND</p><h2>背景与挑战</h2><p>{item.backgroundChallenge}</p></div>
            <ul>{item.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}</ul>
          </section>
          <section className="case-detail-panel"><p className="eyebrow"><span /> SOLUTION</p><h2>我们做了什么</h2><div className="case-detail-solution-grid">{item.solutions.map((solution, index) => <article key={solution.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{solution.title}</h3><p>{solution.description}</p></article>)}</div></section>
          <section className="case-detail-panel"><p className="eyebrow"><span /> TIMELINE</p><h2>实施过程</h2><div className="case-detail-timeline">{item.timeline.map((step) => <article key={step.week}><strong>第{step.week}周</strong><p>{step.action}</p></article>)}</div></section>
          <section className="case-detail-panel"><p className="eyebrow"><span /> RESULTS</p><h2>量化成果</h2><div className="case-detail-result-table"><div className="is-head"><span>指标</span><span>旧站/实施前</span><span>新站/实施后</span><span>变化</span></div>{item.results.map((result) => <div key={result.metric}><span>{result.metric}</span><span>{result.before}</span><span>{result.after}</span><strong>{result.change}</strong></div>)}</div><div className="case-detail-bars" aria-hidden="true">{item.results.slice(0, 5).map((result, index) => <i key={result.metric} style={{ height: `${38 + index * 13}%` }} />)}</div></section>
          <section className="case-detail-panel case-detail-quote"><blockquote>“{item.testimonial.quote}”</blockquote><footer><strong>{item.testimonial.author}</strong><span>{item.testimonial.position}</span></footer></section>
          <section className="case-detail-panel"><p className="eyebrow"><span /> RELATED</p><h2>相关案例推荐</h2><div className="case-library-grid is-related">{related.slice(0, 3).map((relatedItem) => <CaseCard item={relatedItem} key={relatedItem.slug} />)}</div></section>
        </div>
        <section className="case-library-cta"><div className="shell"><h2>希望获得类似成果？立即咨询</h2><ContactCtaAction href="/contact">预约免费咨询 <Icon name="arrow" size={16} /></ContactCtaAction></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
