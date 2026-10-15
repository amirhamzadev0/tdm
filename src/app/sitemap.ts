import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getCategorySlugs } from "@/viewmodels/category.viewmodel";
import { getRepairServiceSlugs } from "@/viewmodels/repair.viewmodel";
import { getProductSlugs } from "@/viewmodels/shop.viewmodel";

const staticRoutes = ["/", "/shop", "/repair", "/offers", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, services] = await Promise.all([
    getProductSlugs(),
    getCategorySlugs(),
    getRepairServiceSlugs(),
  ]);

  const paths = [
    ...staticRoutes,
    ...categories.map((slug) => `/category/${slug}`),
    ...products.map((slug) => `/shop/${slug}`),
    ...services.map((slug) => `/repair/${slug}`),
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
