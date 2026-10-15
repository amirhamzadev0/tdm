import type { SiteInfo } from "@/models/site";

const MAP_QUERY = encodeURIComponent("shop no.14, london plaza, g9 markaz, Islamabad, Pakistan");

// Contact details for the shop.
export const site: SiteInfo = {
  name: "device masters",
  fullName: "The Device Master",
  tagline: "Next-gen devices. Expert repair.",
  description:
    "Buy new, used and refurbished mobiles, laptops and computers, and book expert device repair with free diagnosis and a 30-day warranty.",
  phone: "0325 5578000",
  email: "thedevicemasterofficial@gmail.com",
  address: "Shop No 14, London Plaza, G-9 Markaz, Islamabad",
  mapUrl: `https://www.google.com/maps?q=${MAP_QUERY}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`,
  hours: "Open daily · 10am – 8pm",
  currencySymbol: "PKR",
  social: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/thedevicemasters",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/p/The-Device-Masters-61573032122171/",
    },
  ],
};
