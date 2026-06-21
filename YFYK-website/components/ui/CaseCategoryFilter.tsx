"use client";

import { useMemo, useState } from "react";
import { CaseCenterCard } from "@/components/ui/CaseCenterCard";
import {
  casesCenterCategories,
  filterCasesByCategory,
  type CaseCategoryFilter,
  type CaseCenterItem,
} from "@/lib/content/cases-center";

interface CaseCategoryFilterProps {
  cases: CaseCenterItem[];
}

export function CaseCategoryFilter({ cases }: CaseCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CaseCategoryFilter>("all");
  const filteredCases = useMemo(
    () => filterCasesByCategory(cases, activeCategory),
    [cases, activeCategory],
  );

  return (
    <>
      <div className="cc-tabs-scroll" role="tablist" aria-label="案例分类">
        <div className="cc-tabs">
          {casesCenterCategories.map((category) => {
            const isActive = activeCategory === category.value;
            return (
              <button
                key={category.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`cc-tab${isActive ? " is-active" : ""}`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="cc-case-grid" role="tabpanel">
        {filteredCases.length === 0 ? (
          <p className="cc-empty" role="status">
            暂无已发布案例，请稍后再来查看。
          </p>
        ) : (
          filteredCases.map((item) => <CaseCenterCard item={item} key={item.slug} />)
        )}
      </div>
    </>
  );
}
