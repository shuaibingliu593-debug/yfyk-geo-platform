"use client";

import { useMemo, useState } from "react";
import { FaqAccordionList } from "@/components/faq/FaqAccordionList";
import {
  faqCategories,
  filterFaqItems,
  type FaqCategoryFilter,
  type FaqItem,
} from "@/lib/content/faq";

interface FaqBrowseSectionProps {
  items: FaqItem[];
}

export function FaqBrowseSection({ items }: FaqBrowseSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(
    () => filterFaqItems(items, activeCategory, searchQuery),
    [items, activeCategory, searchQuery],
  );

  return (
    <section className="faq-band faq-browse-band is-soft" id="faq-list">
      <div className="shell faq-browse-stack">
        <label className="faq-search" htmlFor="faq-search-input">
          <span className="sr-only">搜索 FAQ</span>
          <input
            id="faq-search-input"
            type="search"
            placeholder="搜索问题或关键词…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="faq-tabs-scroll" role="tablist" aria-label="FAQ分类">
          <div className="faq-tabs">
            {faqCategories.map((category) => {
              const isActive = activeCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`faq-tab${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
        <FaqAccordionList items={filteredItems} />
      </div>
    </section>
  );
}
