"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";

type AccordionContextValue = {
  openItem: string | null;
  toggle: (value: string) => void;
  collapsible: boolean;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion components must be used within Accordion");
  return context;
}

export function Accordion({
  children,
  type = "single",
  collapsible = false,
  defaultValue,
  className,
}: {
  children: ReactNode;
  type?: "single";
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  const [openItem, setOpenItem] = useState<string | null>(defaultValue ?? null);

  const toggle = (value: string) => {
    if (type !== "single") return;
    setOpenItem((current) => {
      if (current === value) return collapsible ? null : current;
      return value;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggle, collapsible }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  value,
  className,
}: {
  children: ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <div className={className} data-state={undefined}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  children,
  value,
  className,
}: {
  children: ReactNode;
  value: string;
  className?: string;
}) {
  const { openItem, toggle } = useAccordion();
  const isOpen = openItem === value;
  const triggerId = useId();
  const contentId = `${triggerId}-content`;

  return (
    <button
      id={triggerId}
      type="button"
      className={className}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => toggle(value)}
    >
      {children}
      <span className="ekb-accordion-icon" aria-hidden="true">
        {isOpen ? "−" : "+"}
      </span>
    </button>
  );
}

export function AccordionContent({
  children,
  value,
  className,
}: {
  children: ReactNode;
  value: string;
  className?: string;
}) {
  const { openItem } = useAccordion();
  const isOpen = openItem === value;

  if (!isOpen) return null;

  return (
    <div className={className} data-state="open">
      {children}
    </div>
  );
}
