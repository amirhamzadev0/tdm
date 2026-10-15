import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

export const getCategoryPageViewModel = cache(async (slug: string) => {
  const category = await container.categories.findBySlug(slug);
  if (!category) return null;

  const [initial, categories] = await Promise.all([
    container.products.list({ category: category.slug, page: 1 }),
    container.categories.list(),
  ]);
  return { category, initial, categories };
});

export const getCategorySlugs = cache(async () => {
  const categories = await container.categories.list();
  return categories.map((category) => category.slug);
});
