import type { GeoServiceFlowIcon, GeoServiceFlowStep } from "@/lib/content/geo-service-flow";

const flowIconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function FlowIcon({ name }: { name: GeoServiceFlowIcon }) {
  switch (name) {
    case "launch":
      return (
        <svg {...flowIconProps}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v2" />
          <path d="M12 4a6 6 0 0 1 4 10.5V18H8v-3.5A6 6 0 0 1 12 4Z" />
        </svg>
      );
    case "scan":
      return (
        <svg {...flowIconProps}>
          <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3" />
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 9.5v5M9.5 12h5" />
        </svg>
      );
    case "compare":
      return (
        <svg {...flowIconProps}>
          <path d="M4 19V5M4 19h16" />
          <path d="m8 15 3-4 3 2.5 4-5" />
          <path d="M18 8h-3M18 8v3" />
        </svg>
      );
    case "layout":
      return (
        <svg {...flowIconProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M9 10v10" />
        </svg>
      );
    case "schema":
      return (
        <svg {...flowIconProps}>
          <path d="M12 3 4 7l8 4 8-4-8-4Z" />
          <path d="m4 12 8 4 8-4M4 17l8 4 8-4" />
        </svg>
      );
    case "knowledge":
      return (
        <svg {...flowIconProps}>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H18v16H7.5A2.5 2.5 0 0 0 5 20.5Z" />
          <path d="M5 5.5A2.5 2.5 0 0 0 7.5 8H18" />
        </svg>
      );
    case "integrate":
      return (
        <svg {...flowIconProps}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.3 11.2 15.4 7M8.3 12.8 15.4 17" />
        </svg>
      );
    case "ops":
      return (
        <svg {...flowIconProps}>
          <path d="M3 12h4l2.2-5 4.3 10 2.5-6H21" />
        </svg>
      );
  }
}

function FlowNode({ number, title, items, icon }: GeoServiceFlowStep) {
  return (
    <article className="geo-service-flow-node is-below">
      <div className="geo-service-flow-node-core">
        <span className="geo-service-flow-node-icon">
          <FlowIcon name={icon} />
        </span>
      </div>
      <div className="geo-service-flow-node-copy">
        <span className="geo-service-flow-node-label">STEP {number}</span>
        <h3>{title}</h3>
        <p>{items.join(" · ")}</p>
      </div>
    </article>
  );
}

export function GeoServiceFlowStack({ steps }: { steps: GeoServiceFlowStep[] }) {
  return (
    <ol className="geo-service-flow-stack" aria-label="GEO 建设服务流程">
      {steps.map((step) => (
        <li key={step.number}>
          <FlowNode {...step} />
        </li>
      ))}
    </ol>
  );
}
