import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

/** Everything the Home page needs, gathered once per request. */
export const getHomePageViewModel = cache(async () => {
  const [content, categories, brands, saleItems, featured, repairServices, offers] =
    await Promise.all([
      container.pages.getHome(),
      container.categories.list(),
      container.categories.listAllBrands(),
      container.products.listOnSale(4),
      container.products.listFeatured(8),
      container.repairs.list(),
      container.offers.list(),
    ]);

  return { content, categories, brands, saleItems, featured, repairServices, offers };
});
