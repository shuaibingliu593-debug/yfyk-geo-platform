import { ContactCtaAction } from "@/components/contact/ContactCtaAction";
import { FaqSectionHeading } from "@/components/faq/FaqSectionHeading";
import { Icon } from "@/components/ui/Icons";
import { faqContactActions, faqContactBenefits } from "@/lib/content/faq";

export function FaqContactSection() {
  return (
    <section className="faq-band" id="contact">
      <div className="shell faq-contact-grid">
        <div className="faq-contact-copy">
          <FaqSectionHeading
            eyebrow="CONTACT"
            title="没有找到您的问题？"
            description="欢迎联系我们获取 GEO、AI搜索与企业知识库建设相关建议。"
          />
          <ul className="faq-contact-benefits">
            {faqContactBenefits.map((item) => (
              <li key={item}>
                <Icon name="shield" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="faq-contact-card">
          <p className="faq-contact-card-label">联系我们</p>
          <ul className="faq-contact-actions">
            {faqContactActions.map((action) => (
              <li key={action.label}>
                <strong>{action.label}</strong>
                <span>{action.description}</span>
              </li>
            ))}
          </ul>
          <ContactCtaAction className="button" href="/contact" sourceModule="faq-mid-cta">
            预约免费咨询 <Icon name="arrow" size={17} />
          </ContactCtaAction>
        </aside>
      </div>
    </section>
  );
}
