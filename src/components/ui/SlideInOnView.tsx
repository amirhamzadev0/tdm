"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface SlideInOnViewProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Direct children slide in from the left, one after another, the first time this wrapper
 * scrolls into view. Children are visible by default; the hidden starting state is only applied
 * after mount, so there is no flash without JavaScript or with reduced motion.
 */
export function SlideInOnView({ as: Tag = "div", className, children }: SlideInOnViewProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    Array.from(root.children).forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--i", String(index));
    });

    root.dataset.slide = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          root.dataset.slide = "shown";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
