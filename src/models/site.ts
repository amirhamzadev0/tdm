export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteInfo {
  name: string;
  /** Name shown in the footer and copyright line. */
  fullName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  /** Opens the shop location in a maps app. */
  mapUrl: string;
  hours: string;
  currencySymbol: string;
  social: SocialLink[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
