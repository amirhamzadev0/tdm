export interface ShowcaseCard {
  /** Key of the product illustration in ShowcaseArt. */
  id: "mobiles" | "laptops" | "computers" | "repair" | "accessories";
  label: string;
  href: string;
  badge: string;
  title: string;
  subtitle: string;
  tags: { strong: string; rest: string }[];
  /** Gradient end colours and accent colour of the card. */
  theme: { a: string; b: string; accent: string };
  /** Title size in container-width percent; shrink for long titles. */
  titleSize: number;
}

/** Home page category cards, in display order. */
export const showcaseCards: ShowcaseCard[] = [
  {
    id: "mobiles",
    label: "Mobiles",
    href: "/category/mobiles",
    badge: "Next Generation Smartphone",
    title: "iPHONE 18",
    subtitle: "SMARTPHONE",
    tags: [
      { strong: "Pro", rest: "Camera System" },
      { strong: "All-Day", rest: "Battery" },
    ],
    theme: { a: "#c9cfe6", b: "#6f82b8", accent: "#3a2a8c" },
    titleSize: 7.6,
  },
  {
    id: "laptops",
    label: "Laptops",
    href: "/category/laptops",
    badge: "High Performance",
    title: "GAMING",
    subtitle: "LAPTOPS",
    tags: [
      { strong: "RGB", rest: "Keyboard" },
      { strong: "144Hz", rest: "Display" },
    ],
    theme: { a: "#e5cdef", b: "#a374cf", accent: "#5f2a93" },
    titleSize: 7.4,
  },
  {
    id: "computers",
    label: "Computers",
    href: "/category/computers",
    badge: "Built to Win",
    title: "GAMING PC",
    subtitle: "COMPUTERS",
    tags: [
      { strong: "RGB", rest: "Lighting" },
      { strong: "Custom", rest: "Builds" },
    ],
    theme: { a: "#c5e7ee", b: "#4aa7bf", accent: "#0b6179" },
    titleSize: 6.3,
  },
  {
    id: "repair",
    label: "Repair",
    href: "/repair",
    badge: "Fast Service",
    title: "REPAIR",
    subtitle: "TECHNICIANS",
    tags: [
      { strong: "Free", rest: "Diagnosis" },
      { strong: "30-Day", rest: "Warranty" },
    ],
    theme: { a: "#f2dfc0", b: "#d79b4a", accent: "#8a4a0a" },
    titleSize: 9,
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/category/accessories",
    badge: "Top Picks",
    title: "ACCESSORIES",
    subtitle: "WATCHES & EARBUDS",
    tags: [
      { strong: "Smart", rest: "Watches" },
      { strong: "Wireless", rest: "Earbuds" },
    ],
    theme: { a: "#c8ebdd", b: "#4fb08c", accent: "#0b6b50" },
    titleSize: 5.6,
  },
];
