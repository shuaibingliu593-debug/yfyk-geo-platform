import { Icon, type IconName } from "@/components/ui/Icons";
import { patentsHeroFlow } from "@/lib/content/patents";

function FlowNode({ label, icon }: { label: string; icon: IconName }) {
  return (
    <div className="pat-flow-node">
      <Icon name={icon} size={16} />
      <span>{label}</span>
    </div>
  );
}

export function PatentsHeroDiagram() {
  return (
    <div className="pat-hero-diagram" aria-hidden="true">
      <div className="pat-hero-grid" />
      <div className="pat-cert-card">
        <small>CREDENTIAL</small>
        <strong>技术资质</strong>
        <span>高新技术企业 · 软著 · 知识产权</span>
      </div>
      <div className="pat-flow-stack">
        {patentsHeroFlow.map((step, index) => (
          <div className="pat-flow-step" key={step.label}>
            <FlowNode label={step.label} icon={step.icon} />
            {index < patentsHeroFlow.length - 1 ? (
              <div className="pat-flow-connector" aria-hidden="true">
                <Icon name="arrow" size={14} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <svg className="pat-hero-lines" viewBox="0 0 360 420">
        <line x1="180" y1="60" x2="180" y2="130" />
        <line x1="180" y1="200" x2="180" y2="270" />
        <line x1="180" y1="340" x2="180" y2="390" />
        <circle cx="180" cy="60" r="3.5" />
        <circle cx="180" cy="200" r="3.5" />
        <circle cx="180" cy="340" r="3.5" />
      </svg>
    </div>
  );
}
