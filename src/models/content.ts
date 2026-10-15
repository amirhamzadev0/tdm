export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string };

export interface Highlight {
  title: string;
  text: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  text: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Offering {
  number: string;
  title: string;
  text: string;
  cta: Cta;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    /** [lead, connector, accented word, tail] — the third entry is highlighted. */
    headline: [string, string, string, string];
    summary: string;
    searchPlaceholder: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  trust: Highlight[];
  offerings: { heading: string; items: Offering[] };
  categoriesHeading: string;
  flashSaleHeading: string;
  featuredHeading: string;
  repairHeading: string;
  repairSummary: string;
  offersHeading: string;
  booking: { heading: string; headingAccent: string; summary: string };
}

export interface RepairContent {
  heroTitle: string;
  heroSummary: string;
  process: ProcessStep[];
  guarantees: Highlight[];
}
