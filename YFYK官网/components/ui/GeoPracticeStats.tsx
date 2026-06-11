"use client";

import { useEffect, useRef, useState } from "react";
import type { geoPracticeStats } from "@/lib/content/home";

type GeoPracticeStat = (typeof geoPracticeStats)[number];

function formatStat(value: number, suffix: string) {
  return `${Math.round(value)}${suffix}`;
}

export function GeoPracticeStats({ stats }: { stats: readonly GeoPracticeStat[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const reducedMotionFrame = window.requestAnimationFrame(() => setProgress(1));
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let frame = 0;
    let start = 0;
    const duration = 1300;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(eased);
      if (elapsed < 1) frame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || frame) return;
        frame = window.requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.36 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="geo-practice-stats" aria-label="企业级 GEO 建设实践数据" ref={rootRef}>
      {stats.map((item) => (
        <article key={item.label}>
          <strong aria-label={item.value}>{formatStat(item.countTo * progress, item.suffix)}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </div>
  );
}
