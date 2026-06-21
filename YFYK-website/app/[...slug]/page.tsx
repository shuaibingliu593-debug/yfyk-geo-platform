import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { notFound } from "next/navigation";
import { AISection } from "@/components/seo/AISection";
import { SchemaInjector } from "@/components/seo/SchemaInjector";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ServiceJourneyMap } from "@/components/ui/ServiceJourneyMap";
import { BrandSiteOverview } from "@/components/ui/BrandSiteOverview";
import { GlobalSiteOverview } from "@/components/ui/GlobalSiteOverview";
import { KnowledgeSourceOverview } from "@/components/ui/KnowledgeSourceOverview";
import { UpgradeSiteOverview } from "@/components/ui/UpgradeSiteOverview";
import { ServicesOverview } from "@/components/ui/ServicesOverview";
import { AboutCompany } from "@/components/ui/AboutCompany";
import { getGeoPage, getGeoPageTitle, geoPages } from "@/lib/content/geo-pages";
import type { GeoPageContent } from "@/lib/content/types";
import { getPageSchemas } from "@/lib/schema/pages";

type Props = { params: Promise<{ slug: string[] }> };
const resolve = async ({ params }: Props) => getGeoPage(`/${(await params).slug.join("/")}`);
const section = (page: GeoPageContent, id: string) => page.sections.find((item) => item.id === id);

export function generateStaticParams() {
  return geoPages.map((page) => ({ slug: page.slug.split("/") }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const page = await resolve(props);
  if (!page) return {};
  return {
    title: page.metadata.title,
    description: page.description,
    alternates: { canonical: page.path, types: { "text/markdown": `${page.path}.md` } },
  };
}

function Breadcrumb({ page }: { page: GeoPageContent }) {
  const parts = page.path.split("/").filter(Boolean);
  return (
    <nav className="geo-breadcrumb" aria-label="面包屑">
      <Link href="/">首页</Link>
      {parts.map((_, index) => {
        const path = `/${parts.slice(0, index + 1).join("/")}`;
        return getGeoPage(path) ? <span key={path}><b>/</b><Link aria-current={path === page.path ? "page" : undefined} href={path}>{getGeoPageTitle(path)}</Link></span> : null;
      })}
    </nav>
  );
}

function PageHero({ page }: { page: GeoPageContent }) {
  return (
    <header className="geo-page-hero">
      <div className="geo-page-grid" aria-hidden="true" />
      <div className="shell">
        <Breadcrumb page={page} />
        <p className="eyebrow light"><span /> {page.hero.eyebrow}</p>
        <h1>{page.hero.title}</h1>
        <p>{page.hero.lead}</p>
      </div>
    </header>
  );
}

function Cards({ cards, kind }: { cards: GeoPageContent["capabilities"]; kind: "pain" | "capability" }) {
  return (
    <div className={`geo-card-grid ${kind}`}>
      {cards.map((item, index) => (
        <article className="geo-card" key={item.title}>
          <span>0{index + 1}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function KnowledgeCards({ page }: { page: GeoPageContent }) {
  return <div className="geo-knowledge-grid">{page.professionalKnowledge.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
}

function SceneGallery({ page }: { page: GeoPageContent }) {
  return (
    <div className="geo-scene-gallery" aria-label={`${page.hero.title}实景展示`}>
      {page.visualAssets.map((asset, index) => (
        <figure className="geo-scene-visual" key={asset.src}>
          <Image alt={asset.alt} fill priority={index === 0} sizes="(max-width: 620px) calc(100vw - 48px), (max-width: 900px) calc(100vw - 80px), 1240px" src={asset.src} />
          <figcaption>{asset.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Catalog({ page }: { page: GeoPageContent }) {
  return (
    <>
      {page.catalogGroups.map((group) => (
        <AISection id="service-catalog" key={group.title} summary={group.description} version={page.metadata.version}>
          <div className="geo-section-head"><p className="eyebrow"><span /> SERVICE CATALOG</p><h2>{group.title}</h2><p>{group.description}</p></div>
          <div className="geo-catalog-grid">
            {group.paths.map((path, index) => {
              const child = getGeoPage(path);
              return child ? <Link className="geo-catalog-card" href={path} key={path}><span>0{index + 1}</span><h3>{child.hero.title}</h3><p>{child.description}</p><b>查看服务 <Icon name="arrow" size={15} /></b></Link> : null;
            })}
          </div>
        </AISection>
      ))}
    </>
  );
}

function Faq({ page }: { page: GeoPageContent }) {
  if (!page.faqs.length) return null;
  return (
    <AISection id="frequently-asked-questions" summary={section(page, "frequently-asked-questions")?.summary} version={page.metadata.version}>
      <div className="geo-section-head"><p className="eyebrow"><span /> FAQ</p><h2>常见问题</h2><p>说明适用阶段、交付边界和可验证范围。</p></div>
      <div className="geo-faq">
        {page.faqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
      </div>
    </AISection>
  );
}

function Related({ page }: { page: GeoPageContent }) {
  const related = page.relatedPaths.map(getGeoPage).filter((item): item is GeoPageContent => Boolean(item));
  if (!related.length) return null;
  return (
    <AISection id="related-pages" summary={section(page, "related-pages")?.summary} version={page.metadata.version}>
      <div className="geo-related" aria-labelledby="related-title">
      <div className="geo-section-head"><p className="eyebrow"><span /> RELATED SERVICES</p><h2 id="related-title">继续查看相关页面</h2></div>
      <div className="geo-related-grid">{related.map((item) => <Link href={item.path} key={item.path}>{item.hero.title}<Icon name="arrow" size={14} /></Link>)}</div>
      </div>
    </AISection>
  );
}

function References({ page }: { page: GeoPageContent }) {
  if (!page.publicReferences.length) return null;
  return (
    <AISection id="public-references" summary={section(page, "public-references")?.summary} version={page.metadata.version}>
      <div className="geo-references" aria-labelledby="references-title">
      <div className="geo-section-head"><p className="eyebrow"><span /> PUBLIC REFERENCES</p><h2 id="references-title">公开依据</h2><p>以下链接用于说明工程规则与合规边界，不代表平台对收录或引用作出承诺。</p></div>
      <div className="geo-reference-grid">{page.publicReferences.map((item) => <a href={item.url} key={item.url} rel="noopener noreferrer" target="_blank"><h3>{item.title}</h3><p>{item.description}</p><span>查看公开来源</span></a>)}</div>
      </div>
    </AISection>
  );
}

function Terms({ page }: { page: GeoPageContent }) {
  if (!page.terms.length) return null;
  return <AISection id="defined-terms" summary={section(page, "defined-terms")?.summary} version={page.metadata.version}><div className="geo-term-list" aria-labelledby="term-list-title"><div className="geo-section-head"><p className="eyebrow"><span /> DEFINED TERMS</p><h2 id="term-list-title">工程与合规术语</h2></div>{page.terms.map((item) => <article id={item.id} key={item.id}><h3>{item.term}</h3><p>{item.definition}</p></article>)}</div></AISection>;
}

function ContactDetails({ page }: { page: GeoPageContent }) {
  if (page.path !== "/contact") return null;
  return (
    <AISection id="contact-details" summary={section(page, "contact-details")?.summary} version={page.metadata.version}>
      <div className="geo-contact-details" aria-label="联系信息">
      <article><span>01</span><h2>项目询价</h2><a href="tel:021-61432118">021-61432118</a></article>
      <article><span>02</span><h2>技术咨询</h2><a href="tel:18512131234">18512131234</a></article>
      <article><span>03</span><h2>业务邮箱</h2><a href="mailto:zhangxiaolong@shyfyk.com">zhangxiaolong@shyfyk.com</a></article>
      </div>
    </AISection>
  );
}

export default async function GeoPage(props: Props) {
  const page = await resolve(props);
  if (!page) notFound();
  if (page.path === "/services") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><ServicesOverview page={page} /></>;
  if (page.path === "/services/products/ai-brand-site") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><BrandSiteOverview page={page} /></>;
  if (page.path === "/services/products/ai-global-site") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><GlobalSiteOverview page={page} /></>;
  if (page.path === "/services/upgrade") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><UpgradeSiteOverview page={page} /></>;
  if (page.path === "/services/knowledge-source") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><KnowledgeSourceOverview page={page} /></>;
  if (page.path === "/about") return <><SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} /><AboutCompany page={page} /></>;
  const showEditorialContent = page.templateKind === "editorial";
  const showServiceJourney = page.path.startsWith("/services/");
  return (
    <>
      <SiteHeader />
      <SchemaInjector id={`schema-${page.id}`} schemas={getPageSchemas(page)} />
      <main className={`geo-page geo-template-${page.templateKind}`}>
        <article data-ai-chunk={page.id} data-entity-type={page.pageType} data-version={page.metadata.version}>
          <PageHero page={page} />
          <div className="shell geo-page-body">
            <div className="geo-content-panel">
              <AISection id="service-overview" summary={section(page, "service-overview")?.summary} version={page.metadata.version}>
                <div className="geo-intro-grid"><div><p className="eyebrow"><span /> OVERVIEW</p><h2>服务定义与适用对象</h2><p>{page.description}</p></div><aside><strong>适用对象</strong><p>{page.audience}</p></aside></div>
              </AISection>
              <SceneGallery page={page} />
              <Catalog page={page} />
            </div>
            {showServiceJourney ? <div className="geo-content-panel"><ServiceJourneyMap page={page} /></div> : <div className="geo-content-panel">
              <AISection id="industry-pain-points" summary={section(page, "industry-pain-points")?.summary} version={page.metadata.version}>
                <div className="geo-section-head"><p className="eyebrow"><span /> PROBLEMS FIRST</p><h2>问题与解决方案</h2><p>先确认国内业务场景中的内容、数据与维护风险，再安排对应实施动作。</p></div><Cards cards={page.painPoints} kind="pain" />
              </AISection>
              <AISection id="capabilities" summary={section(page, "capabilities")?.summary} version={page.metadata.version}>
                <div className="geo-subsection-head"><h3>对应实施方法</h3><p>把公开事实、工程交付和发布复查放入同一条工作流。</p></div><Cards cards={page.capabilities} kind="capability" />
              </AISection>
            </div>}
            {!showServiceJourney && <div className="geo-content-panel">
              <AISection id="delivery-process" summary={section(page, "delivery-process")?.summary} version={page.metadata.version}>
                <div className="geo-section-head"><p className="eyebrow"><span /> DELIVERY</p><h2>落地路径与验收</h2><p>实施过程按范围、结构和发布复查三个阶段推进。</p></div><ol className="geo-process">{page.processSteps.map((item, index) => <li key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol>
              </AISection>
              <AISection id="deliverables" summary={section(page, "deliverables")?.summary} version={page.metadata.version}>
                <div className="geo-deliverables"><div><p className="eyebrow light"><span /> DELIVERABLES</p><h2>交付物与验收</h2></div><ul>{page.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </AISection>
            </div>}
            <div className="geo-content-panel">
              {showEditorialContent && <AISection id="professional-knowledge" summary={section(page, "professional-knowledge")?.summary} version={page.metadata.version}>
                <div className="geo-section-head"><p className="eyebrow"><span /> PROFESSIONAL KNOWLEDGE</p><h2>专业知识与中国站点规则</h2><p>将页面相关的工程知识、国内发布条件和数据边界集中说明。</p></div><KnowledgeCards page={page} />
              </AISection>}
              {showEditorialContent && <Terms page={page} />}
              <ContactDetails page={page} />
              <Faq page={page} />
              {showEditorialContent && <References page={page} />}
              {showEditorialContent && <AISection id="china-compliance" summary={section(page, "china-compliance")?.summary} version={page.metadata.version}>
                <div className="geo-compliance"><p className="eyebrow"><span /> CHINA COMPLIANCE</p><h2>中国站点合规提示</h2><ul>{page.chinaCompliance.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </AISection>}
              <Related page={page} />
            </div>
            <AISection id="contact-cta" summary={section(page, "contact-cta")?.summary} version={page.metadata.version}><div className="geo-cta" aria-label="联系优服优科"><div><p className="eyebrow light"><span /> START WITH SCOPE</p><h2>{page.cta.title}</h2><p>{page.cta.description}</p></div><ContactCtaAction className="button button-white" href={page.cta.href}>{page.cta.label}<Icon name="arrow" size={17} /></ContactCtaAction></div></AISection>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
