export interface Category {
  id: string;
  slug: string;
  name: string;
  summary: string;
  /** Brand names stocked in this category. */
  brands: string[];
  order: number;
}
