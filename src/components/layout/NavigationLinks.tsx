"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { NavItem } from "@/models/site";

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.children?.some((child) => pathname.startsWith(child.href)) ?? false;
}

interface Slot {
  left: number;
  width: number;
}

/**
 * Pill navigation. A highlight slides to the hovered link and rests on the link of the
 * current page, with a soft glow underneath.
 */
export function NavigationLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIndex = items.findIndex((item) => isActive(pathname, item));
  const target = hovered ?? (activeIndex >= 0 ? activeIndex : null);
  const slot = target === null ? undefined : slots[target];

  // Measure link positions on mount and whenever the nav is resized.
  useEffect(() => {
    const measure = () => {
      setSlots(
        items.map((_, index) => {
          const element = itemRefs.current[index];
          return { left: element?.offsetLeft ?? 0, width: element?.offsetWidth ?? 0 };
        }),
      );
    };

    const observer = new ResizeObserver(measure);
    for (const element of itemRefs.current) if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [items]);

  const indicatorStyle = slot
    ? ({ "--pill-x": `${slot.left}px`, "--pill-w": `${slot.width}px` } as CSSProperties)
    : undefined;

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav__shell" onPointerLeave={() => setHovered(null)} style={indicatorStyle}>
        {slot ? (
          <>
            <span className="nav__glow" aria-hidden="true" />
            <span className="nav__pill" aria-hidden="true" />
          </>
        ) : null}

        <ul className="nav__list">
          {items.map((item, index) => (
            <li
              key={item.href}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className="nav__item"
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
            >
              <Link
                href={item.href}
                className="nav__link"
                aria-current={index === activeIndex ? "page" : undefined}
              >
                {item.label}
              </Link>
              {item.children ? (
                <ul className="nav__dropdown">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="nav__link"
                        aria-current={pathname === child.href ? "page" : undefined}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
