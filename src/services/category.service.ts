import type { Category } from "@/models/category";
import type { CategoryRepository } from "@/repositories/contracts";

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async list(): Promise<Category[]> {
    return this.repository.findAll();
  }

  /** Every brand across all categories, de-duplicated, in category order. */
  async listAllBrands(): Promise<string[]> {
    const categories = await this.repository.findAll();
    return [...new Set(categories.flatMap((category) => category.brands))];
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.repository.findBySlug(slug);
  }
}
