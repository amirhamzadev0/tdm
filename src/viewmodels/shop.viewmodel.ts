import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

export const getShopPageViewModel = cache(async (search = "") => {
  const [initial, categories] = await Promise.all([
    container.products.list({ page: 1, search: search.trim().slice(0, 100) || undefined }),
    container.categories.list(),
  ]);
  return { initial, categories };
});

export const getProductPageViewModel = cache(async (slug: string) => {
  const product = await container.products.findBySlug(slug);
  if (!product) return null;

  const [category, related] = await Promise.all([
    container.categories.findBySlug(product.category),
    container.products.listRelated(product, 4),
  ]);
  return { product, category, related };
});

export const getProductSlugs = cache(async () => {
  const products = await container.products.listAll();
  return products.map((product) => product.slug);
});

export const getShopBrands = cache(async () => container.categories.listAllBrands());
