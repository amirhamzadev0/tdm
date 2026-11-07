import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getCategorySectionParams, getCategorySlugs } from "@/viewmodels/category.viewmodel";
import { getRepairServiceSlugs } from "@/viewmodels/repair.viewmodel";
import { getProductSlugs } from "@/viewmodels/shop.viewmodel";

const staticRoutes = ["/", "/shop", "/parts", "/repair", "/offers", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, sections, services] = await Promise.all([
    getProductSlugs(),
    getCategorySlugs(),
    getCategorySectionParams(),
    getRepairServiceSlugs(),
  ]);

  const paths = [
    ...staticRoutes,
    ...categories.map((slug) => `/category/${slug}`),
    ...sections.map((item) => `/category/${item.slug}/${item.sub}`),
    ...products.map((slug) => `/shop/${slug}`),
    ...services.map((slug) => `/repair/${slug}`),
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
