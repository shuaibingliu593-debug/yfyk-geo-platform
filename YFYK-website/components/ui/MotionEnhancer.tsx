"use client";

import { useEffect } from "react";

export function MotionEnhancer() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { rootMargin: "-6% 0px -6%", threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));

    const hero = document.querySelector<HTMLElement>(".hero");
    const moveGlow = (event: PointerEvent) => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    };
    hero?.addEventListener("pointermove", moveGlow);
    return () => {
      document.documentElement.classList.remove("motion-ready");
      observer.disconnect();
      hero?.removeEventListener("pointermove", moveGlow);
    };
  }, []);

  return null;
}
