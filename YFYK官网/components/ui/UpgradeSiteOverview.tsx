import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { UpgradeAnchorNav } from "@/components/ui/UpgradeAnchorNav";
import { upgradeFaqs, upgradeHighlights, upgradeServices } from "@/lib/content/upgrade-site-overview";
import type { GeoPageContent } from "@/lib/content/types";

const Heading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => <div className="upgrade-heading"><p className="eyebrow light"><span /> {eyebrow}</p><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>;

export function UpgradeSiteOverview({ page }: { page: GeoPageContent }) {
  const version = page.metadata.version;
  return <><SiteHeader /><main className="upgrade-page">
    <AISection id="top" summary="不改颜值，改变 AI 眼中的你。" version={version}><div className="upgrade-hero"><div className="upgrade-grid-bg" /><div className="shell"><p className="eyebrow light"><span /> GEO UPGRADE</p><h1>老网站AI友好度升级<br /><em>不改颜值，改变AI眼中的你</em></h1><p>针对现有网站的 GEO 化升级与运维方案。像做一次“AI 体检 + 微创手术”，让旧内容重新具备可发现、可理解、可复查的结构。</p><div className="upgrade-trust"><span>适配主流 AI 场景：ChatGPT · 文心 · Kimi · Perplexity</span><span>交付边界：不承诺平台收录、引用或推荐结果</span></div></div></div></AISection>
    <UpgradeAnchorNav />
    <AISection id="overview" summary="补齐 AI 可读语言，不推翻重来。" version={version}><div className="shell upgrade-overview"><div><Heading eyebrow="OVERVIEW" title="为什么老网站急需一次“AI友好度升级”？" description="先定位结构断点，再按页面价值分批补齐 AI 可读语言。" /><div className="upgrade-highlight-list">{upgradeHighlights.map((item, index) => <article key={item}><Icon name={["source","shield","pulse"][index] as "source"} size={24} /><p>{item}</p></article>)}</div><blockquote>方案兼容主流 CMS、自建站和静态站点；是否需要插件、模板改造或静态注入，会在审计阶段确认。</blockquote></div><div className="upgrade-data-flow"><div><b>旧结构</b><span>内容散落 / 语义断点 / 证据缺状态</span></div><i /><div><b>结构化数据流</b><span>摘要区 / Schema / JSON-LD / 公开证据链</span></div></div></div></AISection>
    {upgradeServices.map((item, index) => <AISection id={item.id} key={item.id} summary={item.description} version={version}><div className={`shell upgrade-service-block ${index % 2 ? "is-reverse" : ""}`}><div><Heading eyebrow={item.eyebrow} title={`${item.title} —— ${item.subtitle}`} description={item.description} /><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><p className="upgrade-deliverable">{item.deliverable}</p></div><Visual id={item.id} /></div></AISection>)}
    <AISection id="upgrade-proof" summary="未授权客户证据不对外展示。" version={version}><div className="shell"><Heading eyebrow="PROOF" title="案例与数据" /><div className="upgrade-proof"><span>AUTHORIZED EVIDENCE</span><h3>客户授权后公开</h3><p>当前页面不展示客户名称、AI 引用增长数字、询盘数字、模拟截图或虚构证言。获得授权后，可补充脱敏行业、实施组合、公开指标和可复查证据。</p><Link href="/cases/showcase">查看案例库 <Icon name="arrow" size={15} /></Link></div></div></AISection>
    <AISection id="upgrade-faq" summary="说明外观影响、效果观测和 CMS 适配。" version={version}><div className="shell"><Heading eyebrow="FAQ" title="常见问题" /><div className="geo-faq">{upgradeFaqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></AISection>
    <AISection id="contact-cta" summary="通过联系页预约免费 AI 诊断。" version={version}><div className="shell upgrade-final-card"><p className="eyebrow light"><span /> FINAL CTA</p><h2>让您的旧网站重新被AI看见</h2><p>首次沟通用于了解网站现状，并确认是否适合做 GEO 快速诊断。</p><ContactCtaAction className="button" href="/contact">预约免费AI诊断 <Icon name="arrow" size={16} /></ContactCtaAction><ContactCtaAction href="/contact">获取GEO升级白皮书</ContactCtaAction></div></AISection>
  </main><SiteFooter /></>;
}

function Visual({ id }: { id: string }) {
  if (id === "geo-audit") return <div className="upgrade-visual upgrade-dashboard"><span>AI VISIBILITY</span><strong>基线评分示意</strong><div><i /></div><b>推荐优先级：按审计结果生成</b></div>;
  if (id === "content-structure") return <div className="upgrade-visual upgrade-code"><pre>{`{\n  "@type": "Product",\n  "name": "Core page",\n  "faq": "AI summary"\n}`}</pre><p>结构化数据 + 页面高亮</p></div>;
  if (id === "authority") return <div className="upgrade-visual upgrade-graph"><b>官网</b><span>ISO</span><span>协会</span><span>媒体</span><span>案例</span></div>;
  if (id === "monitoring") return <div className="upgrade-visual upgrade-chart"><span>引用样本趋势</span><svg viewBox="0 0 320 170" aria-hidden="true"><path d="M24 135 C78 120 98 86 142 96 S204 117 246 63 292 54 306 38" /><circle cx="246" cy="63" r="5" /></svg><b>热门问题：按月复查</b></div>;
  return <div className="upgrade-visual upgrade-api"><div>AI Question</div><i>→</i><div>MCP Endpoint</div><i>→</i><div>Public Data</div></div>;
}
