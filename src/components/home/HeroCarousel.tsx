"use client";

import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/config/hero";
import { BannerPicture } from "../ui/BannerPicture";

const AUTOPLAY_MS = 5000;

export function HeroCarousel({ slides, ctaLabel }: { slides: HeroSlide[]; ctaLabel: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const multiple = count > 1;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (!multiple || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, multiple, paused, go]);

  const current = slides[index];

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-carousel__frame">
        <div className="hero-carousel__clip">
          {slides.map((slide, i) => {
            const picture = (
              <BannerPicture
                src={slide.src}
                mobileSrc={slide.mobileSrc}
                alt=""
                priority={i === 0}
                className="hero-carousel__image"
              />
            );
            const shared = {
              className: "hero-carousel__slide",
              style: { background: slide.bg },
              "data-active": i === index,
              "aria-hidden": i !== index,
            };

            // A banner without a link just stays where it is when clicked.
            return slide.href ? (
              <Link
                key={slide.src}
                href={slide.href}
                aria-label={slide.alt}
                tabIndex={i === index ? 0 : -1}
                {...shared}
              >
                {picture}
              </Link>
            ) : (
              <div key={slide.src} role="img" aria-label={slide.alt} {...shared}>
                {picture}
              </div>
            );
          })}

          {current.showCta ? (
            <Link href={current.ctaHref ?? "/shop"} className="hero-carousel__cta">
              <ShoppingCart aria-hidden="true" size={26} />
              <span>{ctaLabel}</span>
            </Link>
          ) : null}

          {multiple ? (
            <>
              <button
                type="button"
                className="hero-carousel__arrow hero-carousel__arrow--prev"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
              >
                <ChevronLeft aria-hidden="true" size={26} />
              </button>
              <button
                type="button"
                className="hero-carousel__arrow hero-carousel__arrow--next"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
              >
                <ChevronRight aria-hidden="true" size={26} />
              </button>
            </>
          ) : null}
        </div>

        {multiple ? (
          <div className="hero-carousel__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                className="hero-carousel__dot"
                data-active={i === index}
                aria-label={`Show ${slide.alt}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
