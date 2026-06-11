import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { caseCoverBackgroundStyle } from "@/lib/case-cover-style";
import type { CaseStudy } from "@/lib/content/types";

interface CaseGalleryProps {
  cases: CaseStudy[];
  compact?: boolean;
  revealOnHover?: boolean;
}

export function CaseGallery({ cases, compact = false, revealOnHover = false }: CaseGalleryProps) {
  return (
    <div className={`project-case-grid${compact ? " is-compact" : ""}`}>
      {cases.map((item) => (
        <Link
          className={`project-case-card${revealOnHover ? " is-reveal" : ""}`}
          href={item.href}
          id={item.id}
          key={item.id}
          data-reveal
        >
          <span
            className="project-case-bg"
            aria-hidden="true"
            style={caseCoverBackgroundStyle(item.coverImage)}
          />
          {revealOnHover ? (
            <div className="project-case-bottom">
              <div className="project-case-summary">
                <div className="project-case-tags">
                  <small>{item.industry}</small>
                  <small>{item.category}</small>
                </div>
                <h3>{item.title}</h3>
              </div>
              <div className="project-case-reveal">
                <p>{item.description}</p>
                {item.metrics?.length ? (
                  <div className="project-case-metrics">
                    {item.metrics.slice(0, 3).map((metric) => (
                      <span key={metric.label}>
                        <b>{metric.value}</b>
                        <small>{metric.label}</small>
                      </span>
                    ))}
                  </div>
                ) : null}
                <span className="project-case-link">
                  查看详情 <Icon name="arrow" size={16} />
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="project-case-tags">
                <small>{item.industry}</small>
                <small>{item.category}</small>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {compact && item.metrics?.length ? (
                <div className="project-case-metrics">
                  {item.metrics.slice(0, 3).map((metric) => (
                    <span key={metric.label}>
                      <b>{metric.value}</b>
                      <small>{metric.label}</small>
                    </span>
                  ))}
                </div>
              ) : null}
              {!compact ? <blockquote>{item.outcomeSummary}</blockquote> : null}
              <span className="project-case-link">
                查看详情 <Icon name="arrow" size={16} />
              </span>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
