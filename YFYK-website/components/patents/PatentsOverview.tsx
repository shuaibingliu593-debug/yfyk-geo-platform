import Link from "next/link";
import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PatentDocumentCard } from "@/components/patents/PatentDocumentCard";
import { PatentsHeroDiagram } from "@/components/patents/PatentsHeroDiagram";
import { PatentsSectionHeading } from "@/components/patents/PatentsSectionHeading";
import { Icon } from "@/components/ui/Icons";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import { siteConfig } from "@/lib/content/home";
import {
  patentCredentials,
  patentsHeroTags,
  patentsOverviewCards,
} from "@/lib/content/patents";

const version = siteConfig.version;

export function PatentsOverview() {
  return (
    <>
      <SiteHeader />
      <main className="pat-page">
        <AISection
          id="patents-hero"
          summary="YFYK 持续投入数字化、AI搜索与企业知识资产相关技术建设，通过高新技术企业认定、软件著作权与知识产权积累，支撑长期服务能力。"
          version={version}
        >
          <div className="pat-hero">
            <div className="pat-hero-bg" aria-hidden="true" />
            <div className="shell pat-hero-inner">
              <div className="pat-hero-copy">
                <p className="eyebrow light">
                  <span /> TECH CREDENTIALS
                </p>
                <h1>技术资质与创新能力</h1>
                <p>
                  YFYK 持续投入数字化、AI搜索与企业知识资产相关技术建设，通过高新技术企业认定、软件著作权与知识产权积累，支撑长期服务能力。
                </p>
                <div className="pat-hero-tags">
                  {patentsHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <PatentsHeroDiagram />
            </div>
          </div>
        </AISection>

        <AISection
          id="patents-overview"
          summary="技术资质的价值，不在于展示数量，而在于能否支撑真实业务场景中的持续交付。"
          version={version}
        >
          <section className="pat-overview-band">
            <div className="shell">
              <PatentsSectionHeading
                eyebrow="OVERVIEW"
                title="资质与能力概览"
                description="技术资质的价值，不在于展示数量，而在于能否支撑真实业务场景中的持续交付。"
              />
              <div className="pat-overview-grid">
                {patentsOverviewCards.map((card, index) => (
                  <article className="pat-overview-card" key={card.id}>
                    <span>0{index + 1}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </AISection>

        <AISection
          id="patents-credentials"
          summary="以下为企业技术资质与知识产权成果展示，具体信息可在合作沟通中进一步提供。"
          version={version}
        >
          <section className="pat-credentials-band">
            <div className="shell">
              <PatentsSectionHeading
                eyebrow="CREDENTIALS"
                title="证书与知识产权"
                description="以下为企业技术资质与知识产权成果展示，具体信息可在合作沟通中进一步提供。"
              />
              <div className="pat-credentials-grid">
                {patentCredentials.map((credential) => (
                  <PatentDocumentCard credential={credential} key={credential.id} />
                ))}
              </div>
            </div>
          </section>
        </AISection>

        <AISection
          id="patents-cta"
          summary="从技术资质到项目交付，YFYK 帮助企业在 AI 搜索时代建立长期数字资产。"
          version={version}
        >
          <SubpageFinalCta
            eyebrow="GEO SERVICES"
            title="了解我们的 GEO 技术服务"
            description="从技术资质到项目交付，YFYK 帮助企业在 AI 搜索时代建立长期数字资产。"
            primaryButton={{ label: "咨询 GEO 方案", openContactModal: true }}
            secondaryButton={{ label: "查看服务内容", href: "/geo-native-website" }}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
