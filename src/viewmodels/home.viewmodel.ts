import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

/** Everything the Home page needs, gathered once per request. */
export const getHomePageViewModel = cache(async () => {
  const [
    content,
    categories,
    brands,
    saleItems,
    featured,
    newArrivals,
    bestSellers,
    dealItems,
    repairServices,
  ] = await Promise.all([
    container.pages.getHome(),
    container.categories.list(),
    container.categories.listAllBrands(),
    container.products.listOnSale(6),
    container.products.listFeatured(8),
    container.products.listNewArrivals(8),
    container.products.listBestSellers(8),
    container.products.listOnSale(8),
    container.repairs.list(),
  ]);

  return {
    content,
    categories,
    brands,
    saleItems,
    featured,
    newArrivals,
    bestSellers,
    dealItems,
    repairServices,
  };
});
