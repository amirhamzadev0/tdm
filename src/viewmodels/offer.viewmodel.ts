import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

export const getOffersPageViewModel = cache(async () => {
  const saleItems = await container.products.listOnSale(12);
  return { saleItems };
});
