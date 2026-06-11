"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { useBoundedCenterPin } from "@/components/ui/useBoundedCenterPin";
import { businessTechOutlineTabs, type BusinessOutlineTab } from "@/lib/content/business-tech-outline";

function OutlineRows({ tab }: { tab: BusinessOutlineTab }) {
  return (
    <div className="business-outline-list">
      {tab.items.map((item) => (
        <Link key={item.number} className="business-outline-item" href={item.href}>
          <span>{item.number}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
          <b aria-hidden="true"><Icon name="arrow" size={18} /></b>
        </Link>
      ))}
    </div>
  );
}

export function BusinessTechOutline() {
  const [activeId, setActiveId] = useState(businessTechOutlineTabs[0].id);
  const activeTab = businessTechOutlineTabs.find((item) => item.id === activeId) ?? businessTechOutlineTabs[0];
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useBoundedCenterPin(rootRef, copyRef, listRef);

  return (
    <div className="business-outline" ref={rootRef}>
      <div className="business-outline-copy" ref={copyRef}>
        <div className="business-outline-tabs" role="tablist" aria-label="三大业务技术大纲">
          {businessTechOutlineTabs.map((tab) => (
            <button
              aria-selected={activeTab.id === tab.id}
              className={activeTab.id === tab.id ? "is-active" : ""}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="eyebrow"><span /> 三大解决方案（OUR SOLUTIONS）</p>
        <h2>{activeTab.title}</h2>
        <p className="business-outline-lead">{activeTab.description}</p>
        <Link className="button business-outline-detail" href={activeTab.detailHref}>
          了解详情 <Icon name="arrow" size={17} />
        </Link>
      </div>
      <div ref={listRef}>
        <OutlineRows tab={activeTab} />
      </div>
    </div>
  );
}
