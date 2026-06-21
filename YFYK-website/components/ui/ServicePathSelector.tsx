"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icons";

const options = [
  { href: "#core-products", label: "01 · 全新品牌", title: "我是全新品牌，想一步到位", link: "查看核心产品", icon: "source" as const },
  { href: "#site-upgrade", label: "02 · 已有网站", title: "我有老网站，希望低成本见效", link: "查看GEO升级", icon: "pulse" as const },
  { href: "#knowledge-source", label: "03 · 行业信源", title: "我想成为行业AI信源", link: "查看知识库构建", icon: "graph" as const },
];

export function ServicePathSelector() {
  const [activeId, setActiveId] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  const selectPath = (href: string) => {
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", href);
    setActiveId(id);
    document.querySelectorAll(".services-overview-body>section.is-path-highlight").forEach((section) => section.classList.remove("is-path-highlight"));
    target.classList.add("is-path-highlight");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      target.classList.remove("is-path-highlight");
      setActiveId("");
    }, 1500);
  };

  return (
    <>
      <div className="services-selector-grid">
        {options.map((item) => (
          <button key={item.href} onClick={() => selectPath(item.href)} type="button">
            <Icon name={item.icon} size={32} />
            <small>{item.label}</small>
            <strong>{item.title}</strong>
            <span>{item.link} <Icon name="arrow" size={15} /></span>
          </button>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">{activeId ? "已跳转到对应服务板块" : ""}</span>
    </>
  );
}
