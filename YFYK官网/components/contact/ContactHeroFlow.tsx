import { contactFlowSteps } from "@/lib/content/contact";

export function ContactHeroFlow() {
  return (
    <div className="contact-hero-flow" aria-hidden="true">
      <ol className="contact-flow-list">
        {contactFlowSteps.map((step, index) => (
          <li key={step}>
            <article className="contact-flow-node">
              <span className="contact-flow-index">0{index + 1}</span>
              <p>{step}</p>
            </article>
            {index < contactFlowSteps.length - 1 ? (
              <span className="contact-flow-connector" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
