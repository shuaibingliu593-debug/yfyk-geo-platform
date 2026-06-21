import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import {
  geoNativeBusinessModules,
  geoNativeDeliverySteps,
  geoNativeFaqs,
  geoNativeFinalDeliverables,
  geoNativeHeroTags,
  geoNativeThemeCards,
} from "@/lib/content/geo-native-website";
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
    <div className="gnw-heading">
      <p className="eyebrow">
        <span /> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function HeroCapabilityDiagram() {
  return (
    <div className="gnw-hero-diagram" aria-hidden="true">
      <div className="gnw-hero-grid" />
      <div className="gnw-hero-core">
        <small>GEO CORE</small>
        <strong>企业数字资产</strong>
        <span>AI 可读 · 可理解 · 可引用</span>
      </div>
      <div className="gnw-hero-node gnw-hero-node-a">
        <Icon name="source" size={16} />
        <span>Schema</span>
      </div>
      <div className="gnw-hero-node gnw-hero-node-b">
        <Icon name="graph" size={16} />
        <span>llms.txt</span>
      </div>
      <div className="gnw-hero-node gnw-hero-node-c">
        <Icon name="code" size={16} />
        <span>AI Sitemap</span>
      </div>
      <div className="gnw-hero-node gnw-hero-node-d">
        <Icon name="shield" size={16} />
        <span>FAQ</span>
      </div>
      <svg className="gnw-hero-lines" viewBox="0 0 400 360">
        <line x1="200" y1="180" x2="90" y2="70" />
        <line x1="200" y1="180" x2="310" y2="80" />
        <line x1="200" y1="180" x2="70" y2="270" />
        <line x1="200" y1="180" x2="320" y2="280" />
      </svg>
    </div>
  );
}

function BusinessModuleVisual({ id }: { id: string }) {
  if (id === "ai-enterprise-site") {
    return (
      <div className="gnw-visual gnw-visual-enterprise">
        <div className="gnw-visual-header">
          <span>ENTERPRISE STRUCTURE</span>
          <strong>业务能力图谱</strong>
        </div>
        <div className="gnw-visual-blocks">
          {["定位", "服务", "案例", "资质", "FAQ"].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <p>结构化页面 · Schema · 证据链</p>
      </div>
    );
  }
  if (id === "ai-brand-site") {
    return (
      <div className="gnw-visual gnw-visual-brand">
        <div className="gnw-visual-header">
          <span>BRAND EXPRESSION</span>
          <strong>品牌语义层</strong>
        </div>
        <div className="gnw-visual-stack">
          <div>品牌定位</div>
          <div>核心能力</div>
          <div>权威背书</div>
          <div>Organization Schema</div>
        </div>
      </div>
    );
  }
  return (
    <div className="gnw-visual gnw-visual-global">
      <div className="gnw-visual-header">
        <span>GLOBAL AI READY</span>
        <strong>多语言产品目录</strong>
      </div>
      <div className="gnw-visual-products">
        <article>
          <b>Products</b>
          <span>参数 · 认证 · 应用</span>
        </article>
        <article>
          <b>Inquiry</b>
          <span>询盘路径 · FAQ Schema</span>
        </article>
      </div>
    </div>
  );
}

export function GeoNativeWebsiteOverview() {
  return (
    <>
      <SiteHeader />
      <main className="gnw-page">
        <AISection
          id="top"
          summary="从零构建 AI 时代的企业官网，让官网成为可被大模型理解的企业数字资产。"
          version={version}
        >
          <div className="gnw-hero">
            <div className="gnw-hero-bg" aria-hidden="true" />
            <div className="shell gnw-hero-inner">
              <div className="gnw-hero-copy">
                <p className="eyebrow light">
                  <span /> GEO 原生建站
                </p>
                <h1>从零构建 AI 时代的企业官网</h1>
                <p>
                  让官网不只是展示窗口，而是能被豆包、DeepSeek、Kimi、通义、ChatGPT
                  等大模型准确理解、抓取与引用的企业数字资产。
                </p>
                <div className="gnw-hero-tags">
                  {geoNativeHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <HeroCapabilityDiagram />
            </div>
          </div>
        </AISection>

        <AISection
          id="theme-overview"
          summary="AI企业官网、AI品牌官网、AI外贸独立站与建站交付标准四大主题总览。"
          version={version}
        >
          <div className="gnw-theme-band">
            <div className="shell">
              <SectionHeading
                eyebrow="OVERVIEW"
                title="GEO原生建站"
                description="从业务类型到交付标准，完整覆盖 AI 时代企业官网建设路径。"
              />
              <div className="gnw-theme-grid">
                {geoNativeThemeCards.map((card, index) => (
                  <a className="gnw-theme-card" href={`#${card.id}`} key={card.id}>
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

        {geoNativeBusinessModules.map((module, index) => (
          <AISection
            id={module.id}
            key={module.id}
            summary={module.subtitle}
            version={version}
          >
            <div className={`gnw-module-band ${index % 2 === 1 ? "is-alt" : ""}`}>
            <div className={`shell gnw-module ${index % 2 ? "is-reverse" : ""}`}>
              <div className="gnw-module-copy">
                <SectionHeading
                  eyebrow={module.eyebrow}
                  title={module.title}
                  description={module.subtitle}
                />
                <div className="gnw-module-body">
                  <p>{module.body}</p>
                  {module.questions ? (
                    <>
                      <ul className="gnw-question-list">
                        {module.questions.map((q) => (
                          <li key={q}>&ldquo;{q}&rdquo;</li>
                        ))}
                      </ul>
                      <p>
                        AI企业官网的目标，是让企业的业务、资质、案例、能力边界和服务流程，被大模型准确识别，并在合适的问题中成为可信答案来源。
                      </p>
                    </>
                  ) : null}
                </div>
                <div className="gnw-module-groups">
                  <div>
                    <h4>核心建设内容</h4>
                    <ul className="gnw-tag-list">
                      {module.coreItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="gnw-module-meta">
                    <div>
                      <h4>适合客户</h4>
                      <ul>
                        {module.clients.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>交付页面</h4>
                      <ul>
                        {module.pages.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gnw-module-visual-wrap">
                <BusinessModuleVisual id={module.id} />
              </div>
            </div>
            </div>
          </AISection>
        ))}

        <AISection
          id="delivery-standards"
          summary="每一个 GEO 原生网站，都按 AI 可读、可理解、可引用的标准交付。"
          version={version}
        >
          <div className="gnw-delivery-band">
            <div className="shell">
              <SectionHeading
                eyebrow="DELIVERY STANDARDS"
                title="建站交付标准"
                description="每一个 GEO 原生网站，都按 AI 可读、可理解、可引用的标准交付。"
              />
              <ol className="gnw-delivery-flow">
                {geoNativeDeliverySteps.map((step) => (
                  <li key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="gnw-deliverables">
                <div>
                  <p className="eyebrow">
                    <span /> FINAL DELIVERABLES
                  </p>
                  <h3>最终交付物</h3>
                </div>
                <ul>
                  {geoNativeFinalDeliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AISection>

        <AISection
          id="frequently-asked-questions"
          summary="围绕 GEO 原生建站定义、适用场景与实施路径的常见问题。"
          version={version}
        >
          <div className="shell gnw-faq-section">
            <SectionHeading eyebrow="FAQ" title="常见问题" />
            <div className="geo-faq">
              {geoNativeFaqs.map((item) => (
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
          summary="从信息架构到 AI 抓取入口，完整建设面向生成式搜索时代的官网系统。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="START YOUR GEO SITE"
            title="让你的官网从“展示页面”升级为“AI可引用的企业知识源”"
            description="我们帮助企业从信息架构、内容表达、结构化数据到AI抓取入口，完整建设面向生成式搜索时代的官网系统。"
            sourceModule="geo-native-website-cta"
            primaryButton={{ label: "获取GEO建站方案", href: "/contact" }}
            secondaryButton={{ label: "预约官网诊断", href: "/contact" }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
