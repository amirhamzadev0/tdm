import type { NavItem } from "@/models/site";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      {
        label: "Mobiles",
        href: "/category/mobiles",
        children: [
          { label: "Mobiles", href: "/category/mobiles/devices" },
          { label: "Mobile Accessories", href: "/category/mobiles/accessories" },
          { label: "Mobile Parts", href: "/category/mobiles/parts" },
        ],
      },
      {
        label: "Laptops",
        href: "/category/laptops",
        children: [
          { label: "Laptops", href: "/category/laptops/devices" },
          { label: "Laptop Accessories", href: "/category/laptops/accessories" },
          { label: "Laptop Parts", href: "/category/laptops/parts" },
        ],
      },
      {
        label: "Computers",
        href: "/category/computers",
        children: [
          { label: "Computers", href: "/category/computers/devices" },
          { label: "Computer Accessories", href: "/category/computers/accessories" },
          { label: "Computer Parts", href: "/category/computers/parts" },
        ],
      },
      { label: "Accessories", href: "/category/accessories" },
    ],
  },
  {
    label: "Parts",
    href: "/parts",
    children: [
      { label: "Mobile Parts", href: "/category/mobiles/parts" },
      { label: "Laptop Parts", href: "/category/laptops/parts" },
      { label: "Computer Parts", href: "/category/computers/parts" },
    ],
  },
  { label: "Repair", href: "/repair" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];

export interface AnnouncementLink {
  label: string;
  href: string;
  tone?: "gold" | "green";
}

/** Thin strip above the header. */
export const announcementLinks: AnnouncementLink[] = [
  { label: "Free diagnosis · 30-day warranty", href: "/repair", tone: "gold" },
  { label: "Book a repair", href: "/repair#book" },
  { label: "Offers", href: "/offers" },
  { label: "Shop all devices", href: "/shop" },
  { label: "Contact us", href: "/contact" },
];

/** Icon key (resolved in HeaderBar) used for each category in the floating header nav. */
export const categoryNavIcons: Record<string, string> = {
  mobiles: "smartphone",
  laptops: "laptop",
  computers: "monitor",
  accessories: "headphones",
};

/** Icon-only links shown after the categories in the centre of the header. */
export const extraNavItems = [{ label: "Repair", href: "/repair#book", icon: "wrench" }];

/** Shown on the left of the header, next to the logo. */
export const contactNavItem = { label: "Contact", href: "/contact", icon: "phone" };

export const footerNavigation: NavItem[] = [
  { label: "Shop by Category", href: "/#shop-by-category" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "Offers", href: "/#offers" },
];
