import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import {
  brandSiteCapabilities,
  brandSiteComparison,
  brandSiteDeliverables,
  brandSiteFaqs,
  brandSiteModules,
  brandSitePainPoints,
  brandSitePlatforms,
  brandSiteProcess,
  brandSiteTrustItems,
} from "@/lib/content/brand-site-overview";
import type { GeoPageContent } from "@/lib/content/types";

const Heading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => <div className="brand-site-heading"><p className="eyebrow"><span /> {eyebrow}</p><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>;

export function BrandSiteOverview({ page }: { page: GeoPageContent }) {
  const version = page.metadata.version;
  return <><SiteHeader /><main className="brand-site-page">
    <AISection id="top" summary="让品牌美学与 AI 可读结构并行。" version={version}><div className="brand-site-hero"><div className="shell"><p className="eyebrow"><span /> AI BRAND WEBSITE</p><h1>为GEO而生的品牌官网<br /><em>让AI更懂你的品牌故事</em></h1><p>专为消费品牌、高端服务与创意企业打造。在保持品牌独特美学的同时，底层加入 AI 可读的语义结构，让公开品牌信息更容易被主流 AI 准确理解。</p><div className="brand-site-platforms"><strong>覆盖说明</strong><span>{brandSitePlatforms.join(" · ")}</span></div></div></div></AISection>
    <AISection id="trust-overview" summary="仅发布可验证的覆盖范围、证据状态与复查机制。" version={version}><div className="shell brand-site-trust">{brandSiteTrustItems.map((item) => <article key={item.label}><strong>{item.value}</strong><h2>{item.label}</h2><p>{item.note}</p></article>)}</div></AISection>
    <AISection id="brand-challenges" summary="视觉表达与机器理解需要同时设计。" version={version}><div className="shell brand-site-split"><div><Heading eyebrow="WHY CHANGE" title="你的品牌官网，可能正在被AI忽略" /><ul className="brand-site-pains">{brandSitePainPoints.map((item) => <li key={item}>{item}</li>)}</ul><blockquote>我们不改变你呈现给消费者的样子，只增加 AI 能读懂的语言。</blockquote></div><div className="brand-site-before-after"><article><small>BEFORE</small><h3>视觉足够精美</h3><p>品牌故事分散，机器只能读取零散片段。</p><div className="brand-site-noise">··· / ·· / ····</div></article><article><small>AFTER</small><h3>视觉与语义并行</h3><p>定位、故事、产品与证据具备清晰结构。</p><div className="brand-site-structure"><i /><i /><i /><i /></div></article></div></div></AISection>
    <AISection id="brand-comparison" summary="保持设计自由，同时补齐语义结构。" version={version}><div className="shell"><Heading eyebrow="COMPARE" title="AI品牌官网 vs 传统品牌官网" description="品牌团队继续维护视觉内容，我们提供组件库与内容规范，让语义层同步更新。" /><div className="brand-site-table"><div className="brand-site-table-head"><b>维度</b><b>传统品牌官网</b><b>AI品牌官网</b></div>{brandSiteComparison.map(([a,b,c]) => <div key={a}><strong>{a}</strong><span>{b}</span><span>{c}</span></div>)}</div></div></AISection>
    <AISection id="brand-capabilities" summary="在不牺牲美感的前提下实现 AI 友好。" version={version}><div className="shell"><Heading eyebrow="CAPABILITIES" title="不牺牲美感，也能让AI读懂品牌" /><div className="brand-site-capabilities">{brandSiteCapabilities.map((item,index) => <article key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.description}</p><aside><small>举个例子</small>{item.example}</aside></article>)}</div></div></AISection>
    <AISection id="brand-deliverables" summary="交付清单与复查口径均可验收。" version={version}><div className="shell brand-site-delivery"><div><Heading eyebrow="DELIVERABLES" title="交付物与可观测结果" /><ul>{brandSiteDeliverables.map(item => <li key={item}>{item}</li>)}</ul></div><aside><small>OBSERVABLE OUTCOMES</small><h3>用可复查信号判断变化</h3><p>上线后持续记录公开引用样本、品牌关键词问题集、内容健康度和修订项。平台是否收录、引用或推荐由各模型策略决定，我们不承诺不可控结果。</p></aside></div></AISection>
    <AISection id="brand-modules" summary="所有模块可按品牌自由组合。" version={version}><div className="shell"><Heading eyebrow="MODULES" title="它长什么样？" description="典型品牌模块可自由组合，设计风格完全定制。AI 友好组件库不会限制创意。" /><div className="brand-site-modules">{brandSiteModules.map(([title,description],index) => <article key={title}><Icon name={["source","graph","agent","shield","pulse","source"][index] as "source"} size={27} /><h3>{title}</h3><p>{description}</p></article>)}</div></div></AISection>
    <AISection id="brand-proof" summary="未授权客户证据不对外展示。" version={version}><div className="shell"><Heading eyebrow="PROOF" title="案例与信任背书" /><div className="brand-site-proof"><span>AUTHORIZED EVIDENCE</span><h3>客户授权后公开</h3><p>当前页面不展示客户名称、效果数字、模拟截图或虚构证言。获得授权后，可在此补充 Logo、项目背景、公开指标与可复查证据。</p><Link href="/cases/showcase">查看案例库 <Icon name="arrow" size={15} /></Link></div></div></AISection>
    <AISection id="brand-process-faq" summary="从基线诊断到上线复查形成闭环。" version={version}><div className="shell brand-site-process-faq"><div><Heading eyebrow="PROCESS" title="合作流程" /><ol>{brandSiteProcess.map(([number,title,description]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></div><div><Heading eyebrow="FAQ" title="常见问题" /><div className="geo-faq">{brandSiteFaqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></div></AISection>
    <AISection id="contact-cta" summary="通过联系页沟通品牌现状并获取快速诊断。" version={version}><div className="brand-site-cta"><div className="shell"><div><p className="eyebrow"><span /> START YOUR BRAND SITE</p><h2>让AI更容易理解你的品牌</h2><p>首次咨询用于了解品牌现状，并提供免费的 GEO 快速诊断。</p></div><div><ContactCtaAction className="button" href="/contact">预约品牌咨询 <Icon name="arrow" size={16} /></ContactCtaAction><ContactCtaAction href="/contact">获取品牌方案书</ContactCtaAction></div></div></div></AISection>
  </main><SiteFooter /></>;
}
