"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Children, isValidElement, useId, useRef, useState, type ReactNode } from "react";
import { ShowcaseCarousel, type CarouselHandle } from "./ShowcaseCarousel";

interface ProductRailProps {
  title: string;
  href: string;
  /** Anchor id, so other links can jump to this row. */
  id?: string;
  /** One element per card, each with a unique key. */
  children: ReactNode;
}

/**
 * Titled row of product cards that keeps moving on its own: the first card slides out on the
 * left and the next one comes in from the right, like the category carousel. Arrows step it
 * manually, hovering pauses it, and on touch screens it can be swiped.
 */
export function ProductRail({ title, href, id, children }: ProductRailProps) {
  const titleId = useId();
  const carousel = useRef<CarouselHandle>(null);
  const [scrollable, setScrollable] = useState(true);

  const items = Children.toArray(children).map((child, index) => ({
    id: isValidElement(child) && child.key !== null ? String(child.key) : String(index),
    node: child,
  }));

  return (
    <section className="rail" id={id} aria-labelledby={titleId}>
      <header className="rail__head">
        <h2 id={titleId} className="rail__title">
          {title}
        </h2>
        <div className="rail__actions">
          {scrollable ? (
            <>
              <button
                type="button"
                className="rail__arrow"
                aria-label={`Previous ${title}`}
                onClick={() => carousel.current?.prev()}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="rail__arrow"
                aria-label={`Next ${title}`}
                onClick={() => carousel.current?.next()}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </>
          ) : null}
          <Link href={href} className="rail__all">
            View All
          </Link>
        </div>
      </header>

      <ShowcaseCarousel
        items={items}
        label={title}
        variant="rail"
        showDots={false}
        autoplayMs={4200}
        controlRef={carousel}
        onScrollableChange={setScrollable}
      />
    </section>
  );
}
