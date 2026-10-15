import type { ProductCondition } from "@/models/product";

const priceFormatter = new Intl.NumberFormat("en-US");

export function formatPrice(amount: number): string {
  return `PKR ${priceFormatter.format(amount)}`;
}

export function discountPercent(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

const conditionLabels: Record<ProductCondition, string> = {
  new: "New",
  used: "Used",
  refurbished: "Refurbished",
};

export function conditionLabel(condition: ProductCondition): string {
  return conditionLabels[condition];
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
