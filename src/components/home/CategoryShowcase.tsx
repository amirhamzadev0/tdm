import Link from "next/link";
import type { CSSProperties } from "react";
import { showcaseCards } from "@/config/showcase";
import { showcaseArt } from "./ShowcaseArt";
import { ShowcaseCarousel } from "./ShowcaseCarousel";

export function CategoryShowcase() {
  const items = showcaseCards.map((card) => ({
    id: card.id,
    node: (
      <Link
        href={card.href}
        className={`pcard pcard--${card.id}`}
        aria-label={`${card.label}: ${card.badge}`}
        style={
          {
            "--a": card.theme.a,
            "--b": card.theme.b,
            "--accent": card.theme.accent,
            "--t": card.titleSize,
          } as CSSProperties
        }
      >
        <span className="pcard__bg" aria-hidden="true" />
        <span className="pcard__txt">
          <span className="pcard__pill">
            <b>{card.badge}</b>
          </span>
          <span className="pcard__heading">
            <span className="pcard__title">{card.title}</span>
            <span className="pcard__sub">{card.subtitle}</span>
          </span>
          <span className="pcard__tags">
            {card.tags.map((tag) => (
              <span key={tag.strong} className="pcard__pill">
                <b>{tag.strong}</b> {tag.rest}
              </span>
            ))}
          </span>
        </span>
        <span className="pcard__art" aria-hidden="true">
          {showcaseArt[card.id]}
        </span>
      </Link>
    ),
  }));

  return (
    <section className="showcase" id="shop-by-category" aria-labelledby="showcase-title">
      <header className="showcase__head">
        <p className="showcase__eyebrow">Find your device</p>
        <h2 id="showcase-title" className="showcase__title">
          Shop by Category
        </h2>
      </header>
      <ShowcaseCarousel items={items} label="Shop by category" />
    </section>
  );
}
