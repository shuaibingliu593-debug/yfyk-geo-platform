import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { caseCoverBackgroundStyle } from "@/lib/case-cover-style";
import type { CaseCenterItem } from "@/lib/content/cases-center";

interface CaseCenterCardProps {
  item: CaseCenterItem;
  revealOnHover?: boolean;
}

export function CaseCenterCard({ item, revealOnHover = true }: CaseCenterCardProps) {
  const metrics = item.metrics.slice(0, 3);

  return (
    <Link
      className={`cc-case-card${revealOnHover ? " is-reveal" : ""}`}
      href={`/cases/${item.slug}`}
    >
      <span
        className={item.coverImage ? "cc-case-bg" : `cc-case-bg cc-case-tone-${item.tone}`}
        aria-hidden="true"
        style={caseCoverBackgroundStyle(item.coverImage)}
      />
      {revealOnHover ? (
        <div className="cc-case-bottom">
          <div className="cc-case-summary">
            <div className="cc-case-tags">
              <small>{item.industry}</small>
              <small>{item.caseType}</small>
            </div>
            <h3>{item.title}</h3>
          </div>
          <div className="cc-case-reveal">
            <p>{item.description}</p>
            {metrics.length > 0 ? (
              <div className="cc-case-metrics" data-count={metrics.length}>
                {metrics.map((metric) => (
                  <span key={metric.label}>
                    <b>{metric.value}</b>
                    <small>{metric.label}</small>
                  </span>
                ))}
              </div>
            ) : null}
            <span className="cc-case-link">
              查看详情 <Icon name="arrow" size={16} />
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="cc-case-tags">
            <small>{item.industry}</small>
            <small>{item.caseType}</small>
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {metrics.length > 0 ? (
            <div className="cc-case-metrics" data-count={metrics.length}>
              {metrics.map((metric) => (
                <span key={metric.label}>
                  <b>{metric.value}</b>
                  <small>{metric.label}</small>
                </span>
              ))}
            </div>
          ) : null}
          <span className="cc-case-link">
            查看详情 <Icon name="arrow" size={16} />
          </span>
        </>
      )}
    </Link>
  );
}
