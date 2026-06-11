import type { NewsHeroStackCard } from "@/lib/content/news";

interface NewsHeroStackProps {
  cards: NewsHeroStackCard[];
}

export function NewsHeroStack({ cards }: NewsHeroStackProps) {
  return (
    <div className="news-hero-stack" aria-hidden="true">
      {cards.map((card, index) => (
        <article className={`news-stack-card news-stack-card-${index}`} key={card.slug}>
          <small>{card.categoryLabel}</small>
          <h3>{card.title}</h3>
        </article>
      ))}
    </div>
  );
}
