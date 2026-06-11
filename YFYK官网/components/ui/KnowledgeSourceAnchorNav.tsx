"use client";

import { useEffect, useState } from "react";
import { knowledgeSourceAnchorItems } from "@/lib/content/knowledge-source-overview";

export function KnowledgeSourceAnchorNav() {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const sections = knowledgeSourceAnchorItems.map(([id]) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    setActive(id);
  };

  return <nav className="knowledge-source-anchor-nav" aria-label="企业知识库信源构建页面锚点导航">{knowledgeSourceAnchorItems.map(([id, label]) => <button className={active === id ? "is-active" : ""} key={id} onClick={() => go(id)} type="button"><span />{label}</button>)}</nav>;
}
