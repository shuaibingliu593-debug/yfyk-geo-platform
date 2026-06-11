"use client";

import { useState } from "react";
import type { ProcessStep } from "@/lib/content/types";

export function DeliveryAccordion({ steps }: { steps: ProcessStep[] }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="delivery-accordion">
      <div className="delivery-tabs" role="tablist" aria-label="交付阶段">
        {steps.map((step, index) => (
          <button
            aria-controls={`delivery-panel-${index}`}
            aria-selected={activeStep === index}
            className={activeStep === index ? "is-active" : ""}
            id={`delivery-tab-${index}`}
            key={step.number}
            onFocus={() => setActiveStep(index)}
            onMouseEnter={() => setActiveStep(index)}
            onPointerUp={(event) => {
              if (event.pointerType !== "mouse") setActiveStep(index);
            }}
            role="tab"
            type="button"
          >
            <span>{step.number}</span>
            <strong>{step.title}</strong>
            <small>{step.summary}</small>
          </button>
        ))}
      </div>
      {steps.map((step, index) => (
        <section
          aria-labelledby={`delivery-tab-${index}`}
          className={`delivery-panel${activeStep === index ? " is-active" : ""}`}
          hidden={activeStep !== index}
          id={`delivery-panel-${index}`}
          key={step.number}
          role="tabpanel"
        >
          <p className="delivery-label">STAGE {step.number}</p>
          <h3>{step.title}：{step.painPoint}</h3>
          <blockquote>{step.quote}</blockquote>
          <div className="delivery-output">
            <p>核心交付物</p>
            <ul>{step.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
      ))}
    </div>
  );
}
