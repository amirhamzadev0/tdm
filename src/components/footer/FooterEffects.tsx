"use client";

import { useEffect } from "react";

const CURTAIN_MIN_WIDTH = 992;

/**
 * Drives the footer's scroll effects (no markup of its own):
 *
 * 1. Curtain reveal - on wide screens the footer is pinned under the page, which scrolls
 *    away to uncover it. Enabled by the `footer-curtain` class on <html>, and only when the
 *    footer fits inside the viewport.
 * 2. Scroll-driven scale - `--footer-progress` (0 -> 1) on the footer grows its blocks from
 *    a smaller size to full size as the footer is uncovered.
 */
export function FooterEffects() {
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!footer) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let curtain = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const height = footer.offsetHeight;

      if (reduceMotion) {
        footer.style.setProperty("--footer-progress", "1");
        return;
      }

      const wantCurtain = window.innerWidth >= CURTAIN_MIN_WIDTH && height <= viewport * 0.9;
      if (wantCurtain !== curtain) {
        curtain = wantCurtain;
        root.classList.toggle("footer-curtain", curtain);
      }
      root.style.setProperty("--footer-h", `${height}px`);

      let progress: number;
      if (curtain) {
        // The footer is fixed; its uncovered share is how far we are into the last `height` px.
        const pageEnd = root.scrollHeight;
        progress = (window.scrollY + viewport - (pageEnd - height)) / height;
      } else {
        const rect = footer.getBoundingClientRect();
        progress = (viewport - rect.top) / Math.max(rect.height, 1);
      }
      footer.style.setProperty("--footer-progress", String(Math.min(1, Math.max(0, progress))));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(footer);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("footer-curtain");
      root.style.removeProperty("--footer-h");
    };
  }, []);

  return null;
}
