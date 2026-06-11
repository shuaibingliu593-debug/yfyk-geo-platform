import { AISection } from "@/components/seo/AISection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactChannelCards } from "@/components/contact/ContactChannelCards";
import { ContactHeroFlow } from "@/components/contact/ContactHeroFlow";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SubpageFinalCta } from "@/components/ui/SubpageFinalCta";
import { contactFinalCta, contactHeroTags } from "@/lib/content/contact";
import { siteConfig } from "@/lib/content/home";

export function ContactOverview() {
  const version = siteConfig.version;

  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <AISection
          id="contact-hero"
          summary="无论您希望建设 GEO 原生官网、升级现有网站，还是规划企业知识库工程，我们都愿意与您一起探讨 AI 搜索时代的数字增长机会。"
          version={version}
        >
          <section className="contact-hero">
            <div className="contact-hero-bg" aria-hidden="true" />
            <div className="shell contact-hero-inner">
              <div className="contact-hero-copy">
                <p className="eyebrow light">
                  <span /> CONTACT
                </p>
                <h1>与我们取得联系</h1>
                <p>
                  无论您希望建设 GEO 原生官网、升级现有网站，还是规划企业知识库工程，我们都愿意与您一起探讨
                  AI 搜索时代的数字增长机会。
                </p>
                <div className="contact-hero-tags">
                  {contactHeroTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <ContactHeroFlow />
            </div>
          </section>
        </AISection>

        <AISection
          id="contact-channels"
          summary="您可以直接发送邮件，也可以填写简短需求，我们会在 1 个工作日内与您联系。"
          version={version}
        >
          <section className="contact-band">
            <div className="shell">
              <header className="contact-section-head" data-reveal>
                <div>
                  <p className="eyebrow">
                    <span /> GET IN TOUCH
                  </p>
                  <h2>选择适合您的沟通方式</h2>
                </div>
                <p>您可以直接发送邮件，也可以填写简短需求，我们会在 1 个工作日内与您联系。</p>
              </header>

              <div className="contact-main-grid">
                <ContactChannelCards />
                <ContactInquiryForm />
              </div>
            </div>
          </section>
        </AISection>

        <AISection
          id="contact-cta"
          summary={contactFinalCta.description}
          version={version}
        >
          <SubpageFinalCta
            eyebrow={contactFinalCta.eyebrow}
            title={contactFinalCta.title}
            description={contactFinalCta.description}
            primaryButton={contactFinalCta.primaryButton}
            secondaryButton={contactFinalCta.secondaryButton}
          />
        </AISection>
      </main>
      <SiteFooter />
    </>
  );
}
