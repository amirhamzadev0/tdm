/** A section inside a category, e.g. "Mobile Parts" inside Mobiles. */
export interface SubCategory {
  /** URL part: /category/<category>/<slug>. */
  slug: string;
  name: string;
  summary: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  summary: string;
  /** Brand names stocked in this category. */
  brands: string[];
  order: number;
  /** Sections (devices, accessories, parts). Categories without any are not split. */
  subcategories?: SubCategory[];
}
