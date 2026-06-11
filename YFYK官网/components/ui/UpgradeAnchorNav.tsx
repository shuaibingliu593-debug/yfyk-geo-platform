"use client";

import { useEffect, useState } from "react";
import { upgradeAnchorItems } from "@/lib/content/upgrade-site-overview";

export function UpgradeAnchorNav() {
  const [active, setActive] = useState("overview");
  useEffect(() => {
    const sections = upgradeAnchorItems.map(([id]) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] });
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
  return <nav className="upgrade-anchor-nav" aria-label="老网站升级页面锚点导航">{upgradeAnchorItems.map(([id, label]) => <button className={active === id ? "is-active" : ""} key={id} onClick={() => go(id)} type="button"><span />{label}</button>)}</nav>;
}
