import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { KnowledgeSourceAnchorNav } from "@/components/ui/KnowledgeSourceAnchorNav";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { enterpriseTerminologyBullets, knowledgeSourceFaqs, knowledgeSourceHighlights, knowledgeSourceServices } from "@/lib/content/knowledge-source-overview";
import type { GeoPageContent } from "@/lib/content/types";

const Heading = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => <div className="knowledge-source-heading"><p className="eyebrow light"><span /> {eyebrow}</p><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>;

export function KnowledgeSourceOverview({ page }: { page: GeoPageContent }) {
  const version = page.metadata.version;
  return <><SiteHeader /><main className="knowledge-source-page">
    <AISection id="top" summary="将企业专业知识建设为 AI 更容易理解、复查和引用的行业信源。" version={version}><div className="knowledge-source-hero"><div className="knowledge-source-network-bg" /><div className="shell"><p className="eyebrow light"><span /> KNOWLEDGE SOURCE</p><h1>企业知识库信源构建<br /><em>成为AI可复查的行业信源</em></h1><p>将您的内部专业知识、产品资料、案例和白皮书系统化打造成 AI 更容易理解、复查和引用的知识资产。面向文心一言、ChatGPT、Perplexity 等主流 AI 场景，建立可维护的企业权威内容底座。</p><div className="knowledge-source-trust"><span>适配主流 AI 模型</span><span>支持 Markdown / JSON 输出</span><span>持续影响力监测</span></div></div></div></AISection>
    <KnowledgeSourceAnchorNav />
    <AISection id="overview" summary="从散落资料变成结构化信源。" version={version}><div className="shell knowledge-source-overview"><div><Heading eyebrow="OVERVIEW" title="为什么企业需要构建专属AI知识库？" description="普通网站等待抓取，知识库则把专业事实整理成可读取、可追踪、可授权调用的稳定信源。" /><div className="knowledge-source-highlight-list">{knowledgeSourceHighlights.map((item, index) => <article key={item}><Icon name={["source","pulse","shield"][index] as "source"} size={24} /><p>{item}</p></article>)}</div><blockquote>我们不只帮你建知识库，而是帮你建立 AI 眼中更清晰、更可复查的行业知识入口。</blockquote></div><Visual id="overview" /></div></AISection>
    {knowledgeSourceServices.filter((item) => item.id === "strategy").map((item, index) => (
      <AISection id={item.id} key={item.id} summary={item.description} version={version}><div className={`shell knowledge-source-service-block ${index % 2 ? "is-reverse" : ""}`}><div><Heading eyebrow={item.eyebrow} title={`${item.title} —— ${item.subtitle}`} description={item.description} /><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><p className="knowledge-source-deliverable">{item.deliverable}</p></div><Visual id={item.id} /></div></AISection>
    ))}
    <AISection id="enterprise-terminology" summary="统一术语定义与语义关联，降低 AI 误解风险。" version={version}>
      <div className="shell knowledge-source-service-block">
        <div>
          <Heading eyebrow="TERMINOLOGY" title="企业术语库 —— 让 AI 读懂你的专业语言" description="将分散在各系统中的术语、别名与标准定义整理为可维护、可引用的企业术语注册表。" />
          <ul>{enterpriseTerminologyBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          <p className="knowledge-source-deliverable">术语库是 FAQ 知识体系的基础层，确保不同渠道引用同一套公开口径。</p>
        </div>
        <Visual id="engineering" />
      </div>
    </AISection>
    {knowledgeSourceServices.filter((item) => item.id !== "strategy").map((item, index) => (
      <AISection id={item.id} key={item.id} summary={item.description} version={version}><div className={`shell knowledge-source-service-block ${index % 2 ? "is-reverse" : ""}`}><div><Heading eyebrow={item.eyebrow} title={`${item.title} —— ${item.subtitle}`} description={item.description} /><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><p className="knowledge-source-deliverable">{item.deliverable}</p></div><Visual id={item.id} /></div></AISection>
    ))}
    <AISection id="knowledge-proof" summary="未授权客户证据不对外展示。" version={version}><div className="shell"><Heading eyebrow="PROOF" title="案例与数据" /><div className="knowledge-source-proof"><span>AUTHORIZED EVIDENCE</span><h3>客户授权后公开</h3><p>当前页面不展示客户名称、文档数量、AI 引用占比、咨询提升数据、模拟截图或虚构证言。获得授权后，可补充脱敏行业、实施组合、公开指标和可复查证据。</p><Link href="/cases/showcase">查看案例库 <Icon name="arrow" size={15} /></Link></div></div></AISection>
    <AISection id="knowledge-faq" summary="说明 Wiki 差异、安全边界和实施周期。" version={version}><div className="shell"><Heading eyebrow="FAQ" title="常见问题" /><div className="geo-faq">{knowledgeSourceFaqs.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></AISection>
    <AISection id="contact-cta" summary="通过联系页预约免费战略咨询。" version={version}><div className="shell knowledge-source-final-card"><p className="eyebrow light"><span /> FINAL CTA</p><h2>让您的专业知识成为AI可复查的权威信源</h2><p>首次沟通用于确认知识范围、公开边界、资料状态和是否适合接入 MCP。</p><ContactCtaAction className="button" href="/contact">预约免费战略咨询 <Icon name="arrow" size={16} /></ContactCtaAction><ContactCtaAction href="/contact">获取信源建设白皮书</ContactCtaAction></div></AISection>
  </main><SiteFooter /></>;
}

function Visual({ id }: { id: string }) {
  if (id === "overview") return <div className="knowledge-source-visual knowledge-source-files"><div><b>散落文档</b><span>PDF / Wiki / CRM / FAQ</span></div><i /><div><b>结构化知识图谱</b><span>Entity / JSON-LD / QA / MCP</span></div></div>;
  if (id === "strategy") return <div className="knowledge-source-visual knowledge-source-graph"><b>企业</b><span>产品</span><span>标准</span><span>案例</span><span>论文</span><span>术语</span></div>;
  if (id === "engineering") return <div className="knowledge-source-visual knowledge-source-pipeline"><div>PDF / Word</div><i>→</i><div>信息抽取</div><i>→</i><pre>{`{\n  "@type": "DefinedTerm",\n  "name": "核心实体",\n  "sameAs": "标准术语"\n}`}</pre></div>;
  if (id === "mcp-advanced") return <div className="knowledge-source-visual knowledge-source-mcp"><div>用户问题</div><i>↔</i><div>AI 请求 MCP</div><i>↔</i><div>知识库返回授权答案</div></div>;
  return <div className="knowledge-source-visual knowledge-source-ops"><article><Icon name="pulse" size={22} /><b>持续更新</b><span>知识增量处理</span></article><article><Icon name="shield" size={22} /><b>合规巡检</b><span>CLA 自动检测</span></article><article><Icon name="source" size={22} /><b>引用监测</b><span>公开样本追踪</span></article><article><Icon name="arrow" size={22} /><b>影响力扩张</b><span>信源合作建议</span></article></div>;
}
