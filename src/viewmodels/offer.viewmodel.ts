import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

export const getOffersPageViewModel = cache(async () => {
  const [offers, saleItems] = await Promise.all([
    container.offers.list(),
    container.products.listOnSale(6),
  ]);
  return { offers, saleItems };
});
