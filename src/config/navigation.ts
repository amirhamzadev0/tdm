import type { NavItem } from "@/models/site";

export const mainNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "Mobiles", href: "/category/mobiles" },
      { label: "Laptops", href: "/category/laptops" },
      { label: "Computers", href: "/category/computers" },
      { label: "Accessories", href: "/category/accessories" },
      { label: "Gadgets", href: "/category/gadgets" },
    ],
  },
  { label: "Repair", href: "/repair" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation: NavItem[] = [
  { label: "Shop all devices", href: "/shop" },
  { label: "Repair services", href: "/repair" },
  { label: "Book a repair", href: "/repair#book" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];
