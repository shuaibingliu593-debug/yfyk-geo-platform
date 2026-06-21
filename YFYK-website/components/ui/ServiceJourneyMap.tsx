import type { GeoPageContent } from "@/lib/content/types";

export function ServiceJourneyMap({ page }: { page: GeoPageContent }) {
  return (
    <section className="service-journey" id="service-journey" data-ai-chunk="service-journey" data-version={page.metadata.version}>
      <div className="geo-section-head">
        <p className="eyebrow"><span /> CONNECTED DELIVERY</p>
        <h2>从问题识别到落地验收</h2>
        <p>每一类问题都对应明确的实施动作、落地阶段和验收交付物。</p>
      </div>
      <div className="service-journey-head" aria-hidden="true">
        <span>问题与解决方案</span><span>对应实施方法</span><span>落地路径</span><span>验收交付物</span>
      </div>
      <ol className="service-journey-list">
        {page.painPoints.map((painPoint, index) => {
          const capability = page.capabilities[index];
          const processStep = page.processSteps[index];
          const deliverable = page.deliverables[index];
          return (
            <li key={painPoint.title}>
              <article className="journey-cell journey-problem">
                <small>问题 {String(index + 1).padStart(2, "0")}</small>
                <h3>{painPoint.title}</h3>
                <p>{painPoint.description}</p>
              </article>
              <article className="journey-cell journey-method">
                <small>实施方法</small>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
              <article className="journey-cell journey-process">
                <small>阶段 {String(index + 1).padStart(2, "0")}</small>
                <h3>{processStep.title}</h3>
                <p>{processStep.description}</p>
              </article>
              <article className="journey-cell journey-acceptance">
                <small>验收</small>
                <h3>{deliverable}</h3>
                <p>作为本阶段的明确交付结果，进入项目验收清单。</p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
