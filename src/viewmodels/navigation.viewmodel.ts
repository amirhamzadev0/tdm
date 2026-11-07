import "server-only";
import { cache } from "react";
import { categoryNavIcons, contactNavItem, extraNavItems } from "@/config/navigation";
import { container } from "@/server/container";

/** How many of the newest products each dropdown shows. */
const PANEL_PRODUCTS = 5;

export interface PanelProduct {
  slug: string;
  name: string;
  image: string | null;
}

export interface HeaderNavItem {
  label: string;
  href: string;
  icon: string;
  /** Mega-menu content; items without it are plain icon links. */
  panel?: {
    summary: string;
    /** Newest products shown when the dropdown opens (the devices section, when there is one). */
    products: PanelProduct[];
    /** Sections of the category, e.g. Mobile Parts, each with its own newest products. */
    subcategories: { label: string; href: string; products: PanelProduct[] }[];
  };
}

export interface HeaderNavViewModel {
  /** Icons in the centre of the bar. */
  items: HeaderNavItem[];
  /** Link on the left of the bar, next to the logo. */
  contact: HeaderNavItem;
}

export const getHeaderNavViewModel = cache(async (): Promise<HeaderNavViewModel> => {
  const [categories, allProducts] = await Promise.all([
    container.categories.list(),
    container.products.listAll(),
  ]);

  const toPanel = (list: typeof allProducts): PanelProduct[] =>
    list
      .slice()
      .sort((x, y) => y.order - x.order)
      .slice(0, PANEL_PRODUCTS)
      .map((product) => ({ slug: product.slug, name: product.name, image: product.image }));

  const categoryItems = categories.map<HeaderNavItem>((category) => {
    const inCategory = allProducts.filter((product) => product.category === category.slug);
    const subcategories = (category.subcategories ?? []).map((section) => ({
      label: section.name,
      href: `/category/${category.slug}/${section.slug}`,
      products: toPanel(
        inCategory.filter((product) => (product.subcategory ?? "devices") === section.slug),
      ),
    }));

    return {
      label: category.name,
      href: `/category/${category.slug}`,
      icon: categoryNavIcons[category.slug] ?? "package",
      panel: {
        summary: category.summary,
        subcategories,
        // Opens on the devices section when the category has sections.
        products: subcategories[0]?.products ?? toPanel(inCategory),
      },
    };
  });

  // Parts sits between the product categories and Repair; its sections are every
  // category's parts section, e.g. Mobile Parts, Laptop Parts, Computer Parts.
  const partsSections = categories.flatMap((category) => {
    const section = category.subcategories?.find((item) => item.slug === "parts");
    if (!section) return [];
    return [
      {
        label: section.name,
        href: `/category/${category.slug}/${section.slug}`,
        products: toPanel(
          allProducts.filter(
            (product) => product.category === category.slug && product.subcategory === "parts",
          ),
        ),
      },
    ];
  });
  const partsItem: HeaderNavItem = {
    label: "Parts",
    href: "/parts",
    icon: "cpu",
    panel: {
      summary: "Spare parts and upgrades",
      subcategories: partsSections,
      products: partsSections[0]?.products ?? [],
    },
  };

  return { items: [...categoryItems, partsItem, ...extraNavItems], contact: contactNavItem };
});
