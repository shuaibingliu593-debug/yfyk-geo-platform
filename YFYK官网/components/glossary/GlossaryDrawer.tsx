"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Icon } from "@/components/ui/Icons";
import {
  glossaryCategoryLabels,
  type GlossaryTerm,
} from "@/lib/content/glossary";

interface GlossaryDrawerProps {
  term: GlossaryTerm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRelatedSelect: (id: string) => void;
  getRelatedLabel: (id: string) => string;
}

export function GlossaryDrawer({
  term,
  open,
  onOpenChange,
  onRelatedSelect,
  getRelatedLabel,
}: GlossaryDrawerProps) {
  if (!term) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={term.nameZh}
      description={term.nameEn}
      className="glossary-drawer"
    >
      <div className="glossary-drawer-meta">
        <span className="glossary-category-tag">{glossaryCategoryLabels[term.category]}</span>
      </div>

      <section className="glossary-drawer-section">
        <h3>中文解释</h3>
        <p>{term.explanation}</p>
      </section>

      <section className="glossary-drawer-section">
        <h3>定义</h3>
        <p>{term.definition}</p>
      </section>

      <section className="glossary-drawer-section">
        <h3>为什么重要</h3>
        <p>{term.whyImportant}</p>
      </section>

      <section className="glossary-drawer-section">
        <h3>适用场景</h3>
        <ul className="glossary-drawer-list">
          {term.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="glossary-drawer-section">
        <h3>相关术语</h3>
        <div className="glossary-related-tags is-interactive">
          {term.relatedTermIds.map((id) => (
            <button key={id} type="button" onClick={() => onRelatedSelect(id)}>
              {getRelatedLabel(id)}
            </button>
          ))}
        </div>
      </section>

      <section className="glossary-drawer-section">
        <h3>推荐阅读</h3>
        <ul className="glossary-drawer-reading">
          {term.recommendedReading.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => onOpenChange(false)}>
                {item.label} <Icon name="arrow" size={14} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Drawer>
  );
}
