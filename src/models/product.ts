import type { ContentBlock } from "./content";

export type ProductCondition = "new" | "used";

export interface Product {
  id: string;
  slug: string;
  name: string;
  spec: string;
  /** Selling price in whole PKR. */
  price: number;
  /** Original price in whole PKR, or null when not discounted. */
  oldPrice: number | null;
  /** Brand name, or null when the product is unbranded. */
  brand: string | null;
  condition: ProductCondition;
  /** Category slug. */
  category: string;
  /** Section inside the category (devices, accessories or parts), when it has sections. */
  subcategory?: string;
  image: string | null;
  /** Extra pictures for the product page; falls back to `image`. */
  gallery?: string[];
  /** Average star rating out of 5, when known. */
  rating?: number;
  featured: boolean;
  /** Shown in the Best Sellers row on the home page. */
  bestSeller?: boolean;
  body: ContentBlock[];
  order: number;
}
