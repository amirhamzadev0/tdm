import type { ContentBlock } from "./content";

export type ProductCondition = "new" | "used" | "refurbished";

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
  image: string | null;
  featured: boolean;
  body: ContentBlock[];
  order: number;
}
