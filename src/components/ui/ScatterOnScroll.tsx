"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface ScatterOnScrollProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Tilt (degrees) each item starts with, cycled by index. */
const TILTS = [-9, 6, 10, -6];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - (1 - value) ** 3;

/**
 * Scroll-linked spread. Every `[data-scatter]` descendant starts piled up toward the centre of
 * this wrapper (smaller, tilted, faded), spreads out to its real position as it scrolls into
 * view, and gathers again as it moves up and out of the screen. Without JavaScript, or with
 * reduced motion, items are simply in place.
 *
 * Progress is worked out per item from its own resting position, so tall grids spread row by
 * row. Items gather horizontally toward the centre; for short wrappers they also gather
 * vertically into a single pile.
 */
export function ScatterOnScroll({ as: Tag = "div", className, children }: ScatterOnScrollProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-scatter]"));
      const viewport = window.innerHeight;
      const rootTop = root.getBoundingClientRect().top;
      const centerX = root.clientWidth / 2;
      const centerY = root.clientHeight / 2;
      const pileVertically = root.clientHeight <= viewport * 0.7;

      // Item top edge (px from the top of the screen): starts at `start`, fully in at `peak`,
      // and fully gathered again by `gone`.
      const start = viewport * 0.95;
      const peak = viewport * 0.45;
      const gone = -viewport * 0.05;

      items.forEach((item, index) => {
        // offsetTop/offsetLeft ignore transforms, so these are resting positions.
        const top = rootTop + item.offsetTop;
        const entering = clamp((start - top) / (start - peak));
        const leaving = clamp((top - gone) / (peak - gone));
        const progress = easeOut(Math.min(entering, leaving));
        const gather = 1 - progress;

        const itemX = item.offsetLeft + item.offsetWidth / 2;
        const itemY = item.offsetTop + item.offsetHeight / 2;
        const dx = (centerX - itemX) * gather;
        const dy = pileVertically ? (centerY - itemY) * gather : 0;
        const tilt = (TILTS[index % TILTS.length] ?? 0) * gather;
        const scale = 0.55 + 0.45 * progress;

        // Individual transform properties, so hover transforms on the item still work.
        item.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
        item.style.rotate = `${tilt.toFixed(2)}deg`;
        item.style.scale = scale.toFixed(3);
        item.style.opacity = String(0.25 + 0.75 * progress);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Items can change (filters, pagination); re-apply when they do.
    const mutations = new MutationObserver(schedule);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mutations.disconnect();
      if (frame) cancelAnimationFrame(frame);
      root.querySelectorAll<HTMLElement>("[data-scatter]").forEach((item) => {
        item.style.translate = "";
        item.style.rotate = "";
        item.style.scale = "";
        item.style.opacity = "";
      });
    };
  }, []);

  return (
    <Tag ref={ref} className={className} style={{ position: "relative" }}>
      {children}
    </Tag>
  );
}
