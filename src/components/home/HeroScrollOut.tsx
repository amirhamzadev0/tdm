"use client";

import { useEffect } from "react";

/**
 * Scroll-linked exit for the hero text. Once the entrance animation has played, scrolling
 * down slides each block out to the left (staggered, top block first) and scrolling back up
 * brings them back. It writes `--out` (0 = in place, 1 = gone) on each block.
 */
export function HeroScrollOut() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const copy = document.querySelector<HTMLElement>(".hero__copy");
    const hero = copy?.closest<HTMLElement>(".hero");
    if (!copy || !hero) return;

    const blocks = Array.from(copy.children) as HTMLElement[];
    let settled = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!settled) return;
      // Fully gone after scrolling about half of the hero's height.
      const progress = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.5)));
      blocks.forEach((block, index) => {
        const out = Math.min(1, Math.max(0, progress * 1.6 - index * 0.15));
        block.style.setProperty("--out", out.toFixed(3));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Hand control to scroll once the last entrance animation has finished.
    const lastBlock = blocks[blocks.length - 1];
    const onEntranceEnd = () => {
      settled = true;
      copy.classList.add("hero__copy--settled");
      schedule();
    };
    const fallback = window.setTimeout(onEntranceEnd, 2500);
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === lastBlock) {
        window.clearTimeout(fallback);
        onEntranceEnd();
      }
    };
    lastBlock?.addEventListener("animationend", onAnimationEnd);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.clearTimeout(fallback);
      lastBlock?.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      copy.classList.remove("hero__copy--settled");
      blocks.forEach((block) => block.style.removeProperty("--out"));
    };
  }, []);

  return null;
}
