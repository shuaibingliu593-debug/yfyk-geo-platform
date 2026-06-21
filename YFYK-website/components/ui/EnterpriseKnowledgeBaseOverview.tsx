import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import {
  ekbCapabilityCards,
  ekbDeliverySteps,
  ekbFaqs,
  ekbFinalDeliverables,
  ekbHeroFlow,
  ekbHeroTags,
  ekbServiceModules,
  type EkbServiceModule,
} from "@/lib/content/enterprise-knowledge-base";
import { TerminologyDiagram } from "@/components/ui/TerminologyDiagram";
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
    <div className="ekb-heading">
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function HeroFlowDiagram() {
  return (
    <div className="ekb-hero-flow" aria-hidden="true">
      <div className="ekb-hero-grid" />
      <div className="ekb-flow-stage">
        <small>分散知识</small>
        <div className="ekb-flow-tags">
          {ekbHeroFlow.scattered.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="ekb-flow-arrow" aria-hidden="true">
        <Icon name="arrow" size={18} />
      </div>
      <div className="ekb-flow-stage">
        <small>知识结构化</small>
        <div className="ekb-flow-tags">
          {ekbHeroFlow.structured.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="ekb-flow-arrow" aria-hidden="true">
        <Icon name="arrow" size={18} />
      </div>
      <div className="ekb-flow-stage is-final">
        <small>AI理解</small>
        <div className="ekb-flow-tags">
          {ekbHeroFlow.aiReady.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <svg className="ekb-flow-lines" viewBox="0 0 360 420">
        <line x1="180" y1="90" x2="180" y2="170" />
        <line x1="180" y1="250" x2="180" y2="330" />
        <circle cx="180" cy="90" r="4" />
        <circle cx="180" cy="250" r="4" />
        <circle cx="180" cy="330" r="4" />
      </svg>
    </div>
  );
}

function ModuleVisual({ id }: { id: string }) {
  if (id === "geo-knowledge-center") {
    return (
      <div className="ekb-visual ekb-visual-hub">
        <div className="ekb-visual-header">
          <span>UNIFIED KNOWLEDGE</span>
          <strong>统一知识中心</strong>
        </div>
        <div className="ekb-hub-sources">
          {["产品资料", "技术文档", "白皮书", "FAQ", "案例"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="ekb-hub-core">统一知识中心</div>
        <div className="ekb-hub-outputs">
          {["官网", "AI理解", "销售支持", "客户查询"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    );
  }
  if (id === "faq-knowledge-system") {
    return (
      <div className="ekb-visual ekb-visual-faq">
        <article>
          <small>用户问题</small>
          <p>企业知识库建设需要多长时间？</p>
        </article>
        <div className="ekb-faq-arrow" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </div>
        <article>
          <small>标准答案</small>
          <p>从核心业务、FAQ和术语开始，通常 4–8 周完成首版知识结构。</p>
        </article>
        <div className="ekb-faq-arrow" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </div>
        <article className="is-schema">
          <small>FAQ Schema</small>
          <p>结构化问答数据 → AI可引用答案</p>
        </article>
      </div>
    );
  }
  if (id === "enterprise-terminology") {
    return <TerminologyDiagram />;
  }
  return (
    <div className="ekb-visual ekb-visual-semantic">
      <div className="ekb-semantic-step">普通知识文章</div>
      <i>↓</i>
      <div className="ekb-semantic-step is-highlight">AI Summary</div>
      <i>↓</i>
      <pre>{`{
  "@type": "Article",
  "aiSummary": "核心业务摘要",
  "hasPart": ["FAQ", "术语"]
}`}</pre>
      <i>↓</i>
      <div className="ekb-semantic-step is-final">AI理解与引用</div>
    </div>
  );
}

function ModuleCopy({ module }: { module: EkbServiceModule }) {
  return (
    <>
      <SectionHeading eyebrow={module.eyebrow} title={module.title} description={module.subtitle} />
      <div className="ekb-module-body">
        {module.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="ekb-module-groups">
        <div>
          <h4>核心建设内容</h4>
          <ul className="ekb-tag-list">
            {module.coreWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>输出成果</h4>
          <ul className="ekb-output-list">
            {module.outputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function EnterpriseKnowledgeBaseOverview() {
  return (
    <>
      <SiteHeader />
      <main className="ekb-page">
        <AISection
          id="top"
          summary="帮助企业将官网知识重构为 AI 可理解、可引用、可持续运营的知识资产体系。"
          version={version}
        >
          <div className="ekb-hero">
            <div className="ekb-hero-bg" aria-hidden="true" />
            <div className="shell ekb-hero-inner">
              <div className="ekb-hero-copy">
                <p className="eyebrow light">
                  <span /> ENTERPRISE KNOWLEDGE INFRASTRUCTURE
                </p>
                <h1>让企业知识成为 AI 的可信答案来源</h1>
                <p>
                  将企业沉淀的产品资料、技术文档、FAQ、案例和行业知识，重构为统一、可检索、可引用、可持续增长的知识资产体系。
                </p>
                <div className="ekb-hero-tags">
                  {ekbHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <HeroFlowDiagram />
            </div>
          </div>
        </AISection>

        <AISection
          id="capability-overview"
          summary="从知识中心、FAQ体系、术语库到AI语义增强，构建企业长期积累的知识基础设施。"
          version={version}
        >
          <div className="ekb-capability-band">
            <div className="shell">
              <SectionHeading
                eyebrow="OVERVIEW"
                title="企业知识如何升级为 AI 可用资产"
                description="从知识中心、FAQ体系、术语库到AI语义增强，构建企业长期积累的知识基础设施。"
              />
              <div className="ekb-capability-grid">
                {ekbCapabilityCards.map((card, index) => (
                  <a className="ekb-capability-card" href={`#${card.id}`} key={card.id}>
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

        {ekbServiceModules.map((module, index) => (
          <AISection id={module.id} key={module.id} summary={module.subtitle} version={version}>
            <div className={`ekb-module-band ${index % 2 === 1 ? "is-alt" : ""}`}>
              <div
                className={`shell ekb-module ${module.layout === "split-reverse" ? "is-reverse" : ""}`}
              >
                {module.layout === "split-reverse" ? (
                  <>
                    <div className="ekb-module-visual-wrap">
                      <ModuleVisual id={module.id} />
                    </div>
                    <div className="ekb-module-copy">
                      <ModuleCopy module={module} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ekb-module-copy">
                      <ModuleCopy module={module} />
                    </div>
                    <div className="ekb-module-visual-wrap">
                      <ModuleVisual id={module.id} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </AISection>
        ))}

        <AISection
          id="delivery-standards"
          summary="每一套企业知识库都按可沉淀、可检索、可引用的标准交付。"
          version={version}
        >
          <div className="ekb-delivery-band">
            <div className="shell">
              <SectionHeading
                eyebrow="DELIVERY STANDARDS"
                title="知识库交付标准"
                description="每一套企业知识库都按可沉淀、可检索、可引用的标准交付。"
              />
              <ol className="ekb-delivery-flow">
                {ekbDeliverySteps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="ekb-deliverables">
                <div>
                  <p className="eyebrow">
                    <span /> FINAL DELIVERABLES
                  </p>
                  <h3>最终交付物</h3>
                </div>
                <ul>
                  {ekbFinalDeliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AISection>

        <AISection
          id="frequently-asked-questions"
          summary="围绕企业知识库建设路径、术语价值和MCP扩展说明。"
          version={version}
        >
          <div className="shell ekb-faq-section">
            <SectionHeading eyebrow="FAQ" title="常见问题" />
            <Accordion type="single" collapsible className="ekb-accordion">
              {ekbFaqs.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="ekb-accordion-item">
                  <AccordionTrigger value={`faq-${index}`} className="ekb-accordion-trigger">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent value={`faq-${index}`} className="ekb-accordion-content">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AISection>

        <AISection
          id="contact-cta"
          summary="帮助企业建立统一知识源，让官网内容持续被AI理解、引用和推荐。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="BUILD YOUR KNOWLEDGE BASE"
            title="把企业知识变成 AI 可理解、可引用的长期资产"
            description="帮助企业建立统一知识源，让官网内容持续被AI理解、引用和推荐。"
            sourceModule="enterprise-knowledge-base-cta"
            primaryButton={{ label: "获取知识库建设方案", href: "/contact" }}
            secondaryButton={{ label: "咨询企业知识整理", href: "/contact" }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
