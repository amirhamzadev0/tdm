"use client";

import { useEffect } from "react";

/** Every element that paints the navy dotted grid (see --pattern-navy-grid). */
const GRID_SELECTOR =
  ".hero, .page-hero, .section--navy, .booking__aside, .site-footer, .site-header";
const EASING = 0.16;

/**
 * Makes the grid dots glow white around the mouse. The position eases toward the
 * pointer each frame so the glow trails and flows rather than snapping.
 */
export function GridGlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active: HTMLElement | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const clear = (element: HTMLElement | null) => {
      element?.style.removeProperty("--grid-x");
      element?.style.removeProperty("--grid-y");
    };

    const render = () => {
      frame = 0;
      if (!active) return;
      currentX += (targetX - currentX) * EASING;
      currentY += (targetY - currentY) * EASING;
      active.style.setProperty("--grid-x", `${currentX.toFixed(1)}px`);
      active.style.setProperty("--grid-y", `${currentY.toFixed(1)}px`);
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const element =
        event.target instanceof Element
          ? (event.target.closest(GRID_SELECTOR) as HTMLElement | null)
          : null;

      if (element !== active) {
        clear(active);
        active = element;
        if (element) {
          const rect = element.getBoundingClientRect();
          currentX = event.clientX - rect.left;
          currentY = event.clientY - rect.top;
        }
      }
      if (!active) return;

      const rect = active.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      clear(active);
      active = null;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      clear(active);
    };
  }, []);

  return null;
}
