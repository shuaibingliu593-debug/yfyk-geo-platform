import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { Icon } from "@/components/ui/Icons";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ServicePathSelector } from "@/components/ui/ServicePathSelector";
import {
  coreProductServices,
  geoNativeDeliveryStandards,
  knowledgeOverviewServices,
  servicesOverviewPlatforms,
  servicesOverviewFaqs,
  upgradeOverviewServices,
} from "@/lib/content/services-overview";
import type { GeoPageContent } from "@/lib/content/types";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="services-overview-heading"><p className="eyebrow"><span /> {eyebrow}</p><h2>{title}</h2><p>{description}</p></div>;
}

export function ServicesOverview({ page }: { page: GeoPageContent }) {
  return (
    <>
      <SiteHeader />
      <main className="services-overview-page">
        <section className="services-overview-hero" id="top">
          <div className="shell">
            <div>
              <p className="eyebrow"><span /> GEO SERVICES</p>
              <h1>让AI主动找到你、信任你、推荐你</h1>
              <p>基于 GEO 标准，重点适配国内主流 AI（文心一言、通义千问、Kimi 等），同时兼容国际 AI 模型。从新站打造到老站升级，一步到位。</p>
              <div className="services-platform-strip">
                {servicesOverviewPlatforms.map((item) => <p key={item.label}><strong>{item.label}</strong><span>{item.platforms.join(" · ")}</span></p>)}
              </div>
            </div>
          </div>
        </section>

        <div className="services-overview-body">
          <AISection id="core-products" summary="从零构建遵循 GEO 标准的 AI 友好型官网。" version={page.metadata.version}>
            <div className="shell services-overview-section services-overview-section-split">
              <SectionHeading eyebrow="CORE PRODUCTS" title="核心产品 —— 从零构建AI友好型官网" description="别让您的新网站输在起跑线上。全程遵循 GEO 标准开发，优先确保国内 AI 读懂您的企业，同时兼容国际模型。让 AI 爬得懂、读得透，更容易准确理解。" />
              <div className="services-core-products-content">
                <div className="services-card-grid services-card-grid-three">
                  {coreProductServices.map((item, index) => (
                    <article className="services-overview-card services-anchor-target" id={item.id} key={item.id}>
                      <span>0{index + 1}</span>
                      <div className="services-tags">{item.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <Link href={item.href}>了解详情 <Icon name="arrow" size={15} /></Link>
                    </article>
                  ))}
                </div>
                <div className="services-delivery-standards services-anchor-target" id="geo-native-delivery">
                  <p className="eyebrow"><span /> DELIVERY STANDARDS</p>
                  <h3>建站交付标准</h3>
                  <p>GEO 原生建站按统一事实源与工程门禁交付，确保上线即可被 AI 稳定理解与复查。</p>
                  <ul>{geoNativeDeliveryStandards.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
            </div>
          </AISection>

          <AISection id="site-upgrade" summary="以诊断、改造、监测与连接能力完成老网站 GEO 化升级。" version={page.metadata.version}>
            <div className="shell services-overview-section services-overview-section-split">
              <SectionHeading eyebrow="GEO UPGRADE" title="老网站GEO化升级" description="不需要推翻重来。像做一次“AI 体检 + 微创手术”，重点让国内 AI 重新理解您的旧内容，同时改善国际 AI 中的公开信息表现。" />
              <div className="services-upgrade-grid">
                {upgradeOverviewServices.map((item) => <article className="services-overview-card services-upgrade-card" key={item.title}><span>{item.number}</span><small className="services-card-type">{item.type}</small><h3>{item.title}{item.tooltip ? <i title={item.tooltip} aria-label={item.tooltip}>?</i> : null}</h3><p>{item.description}</p><Link href={item.href}>了解详情 <Icon name="arrow" size={15} /></Link></article>)}
              </div>
            </div>
          </AISection>

          <AISection id="knowledge-source" summary="将企业专业沉淀建设为可维护、可深链、可查询的权威信源。" version={page.metadata.version}>
            <div className="shell services-overview-section services-overview-section-split">
              <SectionHeading eyebrow="KNOWLEDGE SOURCE" title="企业知识库信源构建" description="当 AI 回答行业问题时，您的内容是被当作可靠来源理解和引用，还是被忽略？我们帮助您将内部专业沉淀整理为国内 AI 更容易理解的行业信源，同时兼容国际模型。" />
              <div className="services-card-grid services-card-grid-two">
                {knowledgeOverviewServices.map((item, index) => <article className="services-overview-card services-knowledge-card" key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p><aside><small>为什么需要这个？</small><em>{item.why}</em></aside><Link href={item.href}>了解详情 <Icon name="arrow" size={15} /></Link></article>)}
              </div>
            </div>
          </AISection>

          <AISection id="service-selector" summary="根据企业当前阶段快速选择对应服务板块。" version={page.metadata.version}>
            <div className="shell services-selector">
              <SectionHeading eyebrow="FIND YOUR PATH" title="你是哪一种情况？" description="从企业当前阶段出发，快速定位最适合的实施路径。" />
              <ServicePathSelector />
            </div>
          </AISection>

          <AISection id="frequently-asked-questions" summary="回答 GEO、国内 AI 优先级和默认适配范围。" version={page.metadata.version}>
            <div className="shell services-overview-section services-faq-section">
              <SectionHeading eyebrow="FAQ" title="常见问题" description="先回答最常见的三个问题，再判断哪一条路径适合您的团队。" />
              <div className="geo-faq">{servicesOverviewFaqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
            </div>
          </AISection>
        </div>

        <section className="services-final-cta">
          <div className="shell"><div><p className="eyebrow"><span /> START TODAY</p><h2>让您的官网成为AI更容易理解和引用的企业知识源</h2></div><div className="services-final-actions"><ContactCtaAction className="button" href="/contact">预约免费咨询 <Icon name="arrow" size={17} /></ContactCtaAction><ContactCtaAction className="services-text-link" href="/contact">获取GEO服务概览 <Icon name="arrow" size={15} /></ContactCtaAction></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
