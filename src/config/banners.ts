/** Folder that holds all banner artwork (desktop, and portrait versions for phones). */
const DIR = "/branding/banners";

export type BannerId =
  "mobiles" | "laptops" | "computers" | "repair" | "accessories" | "shop" | "parts";

export interface CategoryBannerConfig {
  id: BannerId;
  label: string;
  /** Page the banner opens: the category page, or /repair. */
  href: string;
  src: string;
  /** Portrait artwork shown on phones. */
  mobileSrc: string;
  alt: string;
  /** Shown behind the artwork: its "Shop now" tab and corners are transparent and meant to sit on the light page. */
  bg: string;
}

/** One banner per category, in display order. Swap a file in /public/branding/banners to change it. */
export const categoryBanners: CategoryBannerConfig[] = [
  {
    id: "mobiles",
    label: "Mobiles",
    href: "/category/mobiles",
    src: `${DIR}/mobile banner.png`,
    mobileSrc: `${DIR}/mobile banner mobile.jpg`,
    alt: "Mobiles",
    bg: "#f4f6fb",
  },
  {
    id: "laptops",
    label: "Laptops",
    href: "/category/laptops",
    src: `${DIR}/laptop banner.png`,
    mobileSrc: `${DIR}/laptop banner mobile.jpg`,
    alt: "Laptops",
    bg: "#f4f6fb",
  },
  {
    id: "computers",
    label: "Computers",
    href: "/category/computers",
    src: `${DIR}/computer banner.png`,
    mobileSrc: `${DIR}/computer banner monile.jpg`,
    alt: "Computers",
    bg: "#f4f6fb",
  },
  {
    id: "repair",
    label: "Repair",
    href: "/repair",
    src: `${DIR}/repair banner.png`,
    mobileSrc: `${DIR}/repair banner mobile.jpg`,
    alt: "Repair",
    bg: "#f4f6fb",
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/category/accessories",
    src: `${DIR}/accessories banner.png`,
    mobileSrc: `${DIR}/accessories banner mobile.jpg`,
    alt: "Accessories",
    bg: "#f4f6fb",
  },
];

/** Banner at the top of the "Shop all devices" page (not part of the home hero rotation). */
export const shopBanner: CategoryBannerConfig = {
  id: "shop",
  label: "Shop all devices",
  href: "/shop",
  src: `${DIR}/shop all banner.png`,
  mobileSrc: `${DIR}/shop all banner mobile.jpg`,
  alt: "Shop all devices",
  bg: "#f4f6fb",
};

/** Banner for the Parts page and the Mobile / Laptop / Computer Parts pages. */
export const partsBanner: CategoryBannerConfig = {
  id: "parts",
  label: "Spare parts",
  href: "/parts",
  src: `${DIR}/parts banner.png`,
  mobileSrc: `${DIR}/parts banner mobile.jpg`,
  alt: "Spare parts",
  bg: "#f4f6fb",
};

/** The general store banner (logo artwork), shown first in the home hero. */
export const brandBanner = {
  src: `${DIR}/the device master banner.png`,
  mobileSrc: `${DIR}/The Devicemasters Mobile Banner.png`,
  alt: "The Device Masters",
  bg: "#0a3d8f",
};

export function getCategoryBanner(id: string): CategoryBannerConfig | undefined {
  return [...categoryBanners, shopBanner, partsBanner].find((banner) => banner.id === id);
}
