"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Category } from "@/models/category";

/** "All / Mobiles / Mobile Accessories / Mobile Parts" tabs shown on a category page. */
export function SubcategoryNav({ category, active }: { category: Category; active?: string }) {
  const navRef = useRef<HTMLElement>(null);

  // On phones the tabs scroll sideways; bring the current one into view.
  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !current) return;
    const offset = current.getBoundingClientRect().left - nav.getBoundingClientRect().left;
    nav.scrollLeft += offset - (nav.clientWidth - current.offsetWidth) / 2;
  }, [active]);

  const sections = category.subcategories;
  if (!sections?.length) return null;

  return (
    <nav ref={navRef} className="subnav" aria-label={`${category.name} sections`}>
      <Link
        href={`/category/${category.slug}`}
        className="subnav__link"
        aria-current={active ? undefined : "page"}
      >
        All
      </Link>
      {sections.map((section) => (
        <Link
          key={section.slug}
          href={`/category/${category.slug}/${section.slug}`}
          className="subnav__link"
          aria-current={active === section.slug ? "page" : undefined}
        >
          {section.name}
        </Link>
      ))}
    </nav>
  );
}
