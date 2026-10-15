export interface RouteSeo {
  title: string;
  description: string;
}

export const routeSeo = {
  home: {
    title: "device masters — Next-gen devices. Expert repair.",
    description:
      "Shop new, used and refurbished mobiles, laptops and computers, and book expert repair with free diagnosis and a 30-day warranty.",
  },
  shop: {
    title: "Shop all devices",
    description:
      "Browse mobiles, laptops, computers, accessories and gadgets — new, used and refurbished.",
  },
  repair: {
    title: "Device repair",
    description:
      "Screen, battery, keyboard, SSD/RAM, software and motherboard repair. Free diagnosis and a 30-day warranty.",
  },
  offers: {
    title: "Offers & codes",
    description: "Discount codes for repairs, checkups and trade-ins at device masters.",
  },
  contact: {
    title: "Contact",
    description: "Visit the shop, call us or send a message to the device masters team.",
  },
  checkout: {
    title: "Checkout",
    description: "Review your cart and place your order.",
  },
} satisfies Record<string, RouteSeo>;
