import { brandBanner, categoryBanners, partsBanner } from "./banners";

export interface HeroSlide {
  src: string;
  /** Portrait artwork shown on phones. */
  mobileSrc: string;
  alt: string;
  /** Page the banner opens, or null when clicking the banner should do nothing. */
  href: string | null;
  /** Shown behind artwork with transparent corners. */
  bg: string;
  /** Category banners already have a "Shop now" tab drawn in; only the store banner needs ours. */
  showCta: boolean;
  /** Where the "Start shopping" tab goes (store banner only). */
  ctaHref?: string;
}

const toSlide = (banner: {
  src: string;
  mobileSrc: string;
  alt: string;
  href: string;
  bg: string;
}): HeroSlide => ({
  src: banner.src,
  mobileSrc: banner.mobileSrc,
  alt: banner.alt,
  href: banner.href,
  bg: banner.bg,
  showCta: false,
});

/**
 * Home hero. The store banner stays on the home page when clicked (only its own
 * "Start shopping" tab leaves it). Every other banner opens its category page, which shows the
 * same banner at the top.
 */
export const heroSlides: HeroSlide[] = [
  { ...brandBanner, href: null, showCta: true, ctaHref: "/shop" },
  ...categoryBanners.slice(0, 3).map(toSlide),
  toSlide(partsBanner),
  ...categoryBanners.slice(3).map(toSlide),
];
