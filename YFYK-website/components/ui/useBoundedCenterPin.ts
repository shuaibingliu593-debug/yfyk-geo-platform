"use client";

import { RefObject, useEffect } from "react";

export function useBoundedCenterPin(
  rootRef: RefObject<HTMLElement | null>,
  pinRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let frame = 0;
    let lastOffset = Number.NaN;

    const update = () => {
      frame = 0;
      const root = rootRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!root || !pin || !track || window.innerWidth <= 1100) {
        if (pin) pin.style.transform = "";
        lastOffset = Number.NaN;
        return;
      }

      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const maxOffset = Math.max(0, track.offsetHeight - pin.offsetHeight);
      const viewportOffset = 96;
      const scrollStart = rootTop - viewportOffset;
      const offset = Math.min(Math.max(window.scrollY - scrollStart, 0), maxOffset);
      if (Math.abs(offset - lastOffset) < 0.1) return;
      lastOffset = offset;
      pin.style.transform = `translate3d(0, ${offset.toFixed(3)}px, 0)`;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(requestUpdate);

    update();
    if (rootRef.current) observer?.observe(rootRef.current);
    if (pinRef.current) observer?.observe(pinRef.current);
    if (trackRef.current) observer?.observe(trackRef.current);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pinRef, rootRef, trackRef]);
}
