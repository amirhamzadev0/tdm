import type { PaymentMethod, ShippingMethod } from "@/models/order";

export const shippingMethods: ShippingMethod[] = [
  { id: "standard", name: "Standard", note: "2–4 days", fee: 100 },
  { id: "express", name: "Express", note: "Next day", fee: 250 },
  { id: "pickup", name: "Store pickup", note: "Ready in 2 hours", fee: 0 },
];

// TODO: replace placeholder payment instructions with the real payment accounts.
export const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on delivery",
    note: "Pay in cash when your order arrives.",
    requiresReference: false,
  },
  {
    id: "bank",
    name: "Bank transfer",
    note: "Transfer to Bank XXXX, A/C 0000000000 and enter the reference below.",
    requiresReference: true,
  },
];

/** Last choice in the repair booking form, for anything not in the service list. */
export const otherRepairService = "Other";
