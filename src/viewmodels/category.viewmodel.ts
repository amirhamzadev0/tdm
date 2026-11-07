import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

/** A category page, or one of its sections when `sub` is given. Null when either is unknown. */
export const getCategoryPageViewModel = cache(async (slug: string, sub?: string) => {
  const category = await container.categories.findBySlug(slug);
  if (!category) return null;

  const subcategory = sub ? category.subcategories?.find((item) => item.slug === sub) : undefined;
  if (sub && !subcategory) return null;

  const [initial, categories] = await Promise.all([
    container.products.list({ category: category.slug, subcategory: sub, page: 1 }),
    container.categories.list(),
  ]);
  return { category, subcategory, initial, categories };
});

export const getCategorySlugs = cache(async () => {
  const categories = await container.categories.list();
  return categories.map((category) => category.slug);
});

/** Every category + section pair, for static generation and the sitemap. */
export const getCategorySectionParams = cache(async () => {
  const categories = await container.categories.list();
  return categories.flatMap((category) =>
    (category.subcategories ?? []).map((item) => ({ slug: category.slug, sub: item.slug })),
  );
});
