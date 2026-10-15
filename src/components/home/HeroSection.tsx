import Image from "next/image";
import type { HomeContent } from "@/models/content";
import { ButtonLink } from "../ui/Button";
import { MagneticText } from "../ui/MagneticText";
import { StarGrid } from "../ui/StarGrid";
import { HeroScrollOut } from "./HeroScrollOut";
import { HeroSearch } from "./HeroSearch";

export function HeroSection({ hero }: { hero: HomeContent["hero"] }) {
  const [lead, connector, accent, tail] = hero.headline;

  return (
    <section className="hero" id="top">
      <StarGrid />
      <HeroScrollOut />
      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {hero.eyebrow}
          </div>
          <MagneticText
            as="h1"
            className="hero__title"
            segments={[
              { text: lead },
              { lineBreak: true },
              { text: `${connector} ` },
              { text: accent, className: "hero__title-accent" },
              { text: ` ${tail}` },
            ]}
          />
          <p className="hero__summary">{hero.summary}</p>
          <HeroSearch placeholder={hero.searchPlaceholder} />
          <div className="hero__actions">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__glow" />
          <div className="hero__ring hero__ring--outer" />
          <div className="hero__ring hero__ring--inner" />
          <div className="orbit orbit--outer">
            <span className="orbit__ball orbit__ball--yellow" />
          </div>
          <div className="orbit orbit--inner">
            <span className="orbit__ball orbit__ball--blue" />
          </div>
          <Image
            src="/branding/logo.png"
            alt=""
            width={232}
            height={232}
            className="hero__logo"
            priority
          />
        </div>
      </div>
    </section>
  );
}
