import type { HomeContent } from "@/models/content";
import { heroSlides } from "@/config/hero";
import { HeroCarousel } from "./HeroCarousel";

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  const title = hero.headline.join(" ");

  return (
    <section className="hero" id="top" aria-label="Featured">
      <h1 className="visually-hidden">{title}</h1>
      <HeroCarousel slides={heroSlides} ctaLabel={hero.primaryCta.label} />
    </section>
  );
}
