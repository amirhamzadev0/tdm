"use client";

import { useEffect } from "react";

const BUTTON_SELECTOR = ".btn, .cart-button";

/**
 * Tracks the mouse over buttons and exposes its position as --mx / --my so the CSS
 * spotlight and the shine line on the border can follow the pointer.
 */
export function ButtonSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>(BUTTON_SELECTOR);
      if (!button) return;

      const rect = button.getBoundingClientRect();
      button.style.setProperty("--mx", `${(event.clientX - rect.left).toFixed(1)}px`);
      button.style.setProperty("--my", `${(event.clientY - rect.top).toFixed(1)}px`);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
