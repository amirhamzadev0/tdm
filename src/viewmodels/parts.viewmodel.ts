import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

const ROW_SIZE = 12;

/** One row per category that sells parts: Mobile Parts, Laptop Parts, Computer Parts. */
export const getPartsPageViewModel = cache(async () => {
  const [categories, products] = await Promise.all([
    container.categories.list(),
    container.products.listAll(),
  ]);

  return categories.flatMap((category) => {
    const section = category.subcategories?.find((item) => item.slug === "parts");
    if (!section) return [];

    const items = products
      .filter((product) => product.category === category.slug && product.subcategory === "parts")
      .sort((a, b) => b.order - a.order)
      .slice(0, ROW_SIZE);

    return items.length > 0
      ? [
          {
            id: `${category.slug}-parts`,
            title: section.name,
            href: `/category/${category.slug}/parts`,
            items,
          },
        ]
      : [];
  });
});
