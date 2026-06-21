import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import {
  afuCapabilityCards,
  afuDeliverySteps,
  afuFaqs,
  afuFinalDeliverables,
  afuHeroAfter,
  afuHeroBefore,
  afuHeroTags,
  afuMcpOpenData,
  afuServiceModules,
} from "@/lib/content/ai-friendly-upgrade";
import { siteConfig } from "@/lib/content/home";

const version = siteConfig.version;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="afu-heading">
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function HeroCompareDiagram() {
  return (
    <div className="afu-hero-compare" aria-hidden="true">
      <div className="afu-hero-grid" />
      <article className="afu-compare-card is-before">
        <small>升级前</small>
        <ul>
          {afuHeroBefore.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <div className="afu-compare-arrow" aria-hidden="true">
        <Icon name="arrow" size={20} />
      </div>
      <article className="afu-compare-card is-after">
        <small>升级后</small>
        <ul>
          {afuHeroAfter.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <svg className="afu-compare-lines" viewBox="0 0 420 320">
        <line x1="110" y1="160" x2="210" y2="160" />
        <line x1="210" y1="160" x2="310" y2="160" />
        <circle cx="110" cy="160" r="4" />
        <circle cx="210" cy="160" r="4" />
        <circle cx="310" cy="160" r="4" />
      </svg>
    </div>
  );
}

function AuthorityEvidenceDiagram() {
  const satellites = [
    { label: "案例", x: 72, y: 62 },
    { label: "认证", x: 148, y: 38 },
    { label: "标准", x: 240, y: 28 },
    { label: "媒体", x: 332, y: 38 },
    { label: "专利", x: 408, y: 62 },
  ] as const;
  const hub = { x: 240, y: 178 };

  return (
    <div className="afu-visual afu-visual-authority">
      <p className="afu-authority-label">AUTHORITY EVIDENCE CHAIN</p>
      <svg
        className="afu-authority-svg"
        viewBox="0 0 480 220"
        role="img"
        aria-label="权威背书证据链：官网连接认证、标准、媒体、专利与案例"
      >
        {satellites.map((node) => (
          <line
            key={node.label}
            x1={hub.x}
            y1={hub.y}
            x2={node.x}
            y2={node.y}
            className="afu-authority-line"
          />
        ))}
        <circle cx={hub.x} cy={hub.y} r="46" className="afu-authority-hub-ring" />
        <circle cx={hub.x} cy={hub.y} r="38" className="afu-authority-hub" />
        <text x={hub.x} y={hub.y + 5} className="afu-authority-hub-text">
          官网
        </text>
        {satellites.map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="30" className="afu-authority-node" />
            <text x={node.x} y={node.y + 4} className="afu-authority-node-text">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="afu-authority-caption">多源证据汇聚 · AI 可识别可信信源</p>
    </div>
  );
}

function ModuleVisual({ id }: { id: string }) {
  if (id === "geo-audit") {
    return (
      <div className="afu-visual afu-visual-dashboard">
        <span>AI VISIBILITY</span>
        <strong>AI可见度得分</strong>
        <div className="afu-score-ring">
          <b>47</b>
          <small>/100</small>
        </div>
        <dl>
          <div>
            <dt>推荐优先级</dt>
            <dd>高</dd>
          </div>
          <div>
            <dt>待优化问题</dt>
            <dd>18 项</dd>
          </div>
        </dl>
      </div>
    );
  }
  if (id === "content-structure") {
    return (
      <div className="afu-visual afu-visual-code">
        <pre>{`{
  "@type": "Organization",
  "name": "企业名称",
  "aiSummary": "核心业务摘要",
  "faq": ["常见问题"],
  "hasPart": ["服务", "案例"]
}`}</pre>
        <p>结构化数据 · AI Summary · FAQ 知识块</p>
      </div>
    );
  }
  if (id === "authority") {
    return <AuthorityEvidenceDiagram />;
  }
  if (id === "monitoring") {
    return null;
  }
  return (
    <div className="afu-visual afu-visual-api">
      <div>AI 提问</div>
      <i>↓</i>
      <div>MCP 接口</div>
      <i>↓</i>
      <div>返回结构化数据</div>
    </div>
  );
}

function ModuleCopy({ module }: { module: (typeof afuServiceModules)[number] }) {
  return (
    <>
      <SectionHeading eyebrow={module.eyebrow} title={module.title} description={module.subtitle} />
      <div className="afu-module-body">
        {module.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {module.id === "mcp-basic" ? (
        <div className="afu-open-data">
          <h4>适合开放的数据</h4>
          <ul className="afu-tag-list">
            {afuMcpOpenData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="afu-module-groups">
        <div>
          <h4>核心工作</h4>
          <ul className="afu-tag-list">
            {module.coreWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>输出成果</h4>
          <ul className="afu-output-list">
            {module.outputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {module.note ? <p className="afu-module-note">{module.note}</p> : null}
    </>
  );
}

export function AiFriendlyUpgradeOverview() {
  return (
    <>
      <SiteHeader />
      <main className="afu-page">
        <AISection
          id="top"
          summary="无需推倒重建，让旧网站重新被 AI 理解、引用与推荐。"
          version={version}
        >
          <div className="afu-hero">
            <div className="afu-hero-bg" aria-hidden="true" />
            <div className="shell afu-hero-inner">
              <div className="afu-hero-copy">
                <p className="eyebrow light">
                  <span /> 老网站 AI 友好度升级
                </p>
                <h1>让已有官网适配 AI 搜索时代</h1>
                <p>
                  无需推倒重建。我们通过 GEO 策略审计、内容结构化、权威信源强化和 AI
                  抓取入口优化，让旧网站更容易被豆包、DeepSeek、Kimi、通义、ChatGPT
                  等大模型准确理解与引用。
                </p>
                <div className="afu-hero-tags">
                  {afuHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <HeroCompareDiagram />
            </div>
          </div>
        </AISection>

        <AISection
          id="capability-overview"
          summary="从诊断、内容、信任、监测到接口能力，系统性提升旧网站在 AI 搜索中的可见度。"
          version={version}
        >
          <div className="afu-capability-band">
            <div className="shell">
              <SectionHeading
                eyebrow="OVERVIEW"
                title="老网站如何完成 AI 友好度升级"
                description="从诊断、内容、信任、监测到接口能力，系统性提升旧网站在 AI 搜索中的可见度。"
              />
              <div className="afu-capability-grid">
                {afuCapabilityCards.map((card, index) => (
                  <a className="afu-capability-card" href={`#${card.id}`} key={card.id}>
                    <span>0{index + 1}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <b>
                      了解详情 <Icon name="arrow" size={14} />
                    </b>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AISection>

        {afuServiceModules.map((module, index) => (
          <AISection id={module.id} key={module.id} summary={module.subtitle} version={version}>
            <div className={`afu-module-band ${index % 2 === 1 ? "is-alt" : ""}`}>
            {module.layout === "stack" ? (
              <div className="shell afu-module-stack">
                <ModuleCopy module={module} />
                <ModuleVisual id={module.id} />
              </div>
            ) : (
              <div
                className={`shell afu-module ${module.layout === "split-reverse" ? "is-reverse" : ""}`}
              >
                <div className="afu-module-copy">
                  <ModuleCopy module={module} />
                </div>
                <div className="afu-module-visual-wrap">
                  <ModuleVisual id={module.id} />
                </div>
              </div>
            )}
            </div>
          </AISection>
        ))}

        <AISection
          id="delivery-standards"
          summary="每一次老网站 AI 友好度升级，都按可检测、可交付、可持续优化的标准完成。"
          version={version}
        >
          <div className="afu-delivery-band">
            <div className="shell">
              <SectionHeading
                eyebrow="DELIVERY STANDARDS"
                title="升级交付标准"
                description="每一次老网站 AI 友好度升级，都按可检测、可交付、可持续优化的标准完成。"
              />
              <ol className="afu-delivery-flow">
                {afuDeliverySteps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="afu-deliverables">
                <div>
                  <p className="eyebrow">
                    <span /> FINAL DELIVERABLES
                  </p>
                  <h3>最终交付物</h3>
                </div>
                <ul>
                  {afuFinalDeliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AISection>

        <AISection
          id="frequently-asked-questions"
          summary="围绕升级路径、GEO与SEO差异、效果观测和MCP阶段说明。"
          version={version}
        >
          <div className="shell afu-faq-section">
            <SectionHeading eyebrow="FAQ" title="常见问题" />
            <div className="geo-faq">
              {afuFaqs.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </AISection>

        <AISection
          id="contact-cta"
          summary="从现有网站出发，补齐 AI 可读性、结构化数据、权威信源和 GEO 监测能力。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="START YOUR UPGRADE"
            title="不用重做官网，也可以先让网站变得更适合 AI 理解"
            description="我们帮助企业从现有网站出发，补齐AI可读性、结构化数据、权威信源和GEO监测能力，让旧官网逐步升级为AI时代的可信内容资产。"
            sourceModule="ai-friendly-upgrade-cta"
            primaryButton={{ label: "获取AI友好度诊断", href: "/contact" }}
            secondaryButton={{ label: "咨询升级方案", href: "/contact" }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
