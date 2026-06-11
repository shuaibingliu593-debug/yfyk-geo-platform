import type { FaqHeroStackCard } from "@/lib/content/faq";

interface FaqHeroStackProps {
  cards: FaqHeroStackCard[];
}

export function FaqHeroStack({ cards }: FaqHeroStackProps) {
  return (
    <div className="faq-hero-stack" aria-hidden="true">
      {cards.map((card, index) => (
        <article className={`faq-stack-card faq-stack-card-${index}`} key={card.question}>
          <small>{card.label}</small>
          <p className="faq-stack-q">
            <span>Q</span>
            {card.question}
          </p>
          <p className="faq-stack-a">
            <span>A</span>
            {card.answer}
          </p>
        </article>
      ))}
    </div>
  );
}
