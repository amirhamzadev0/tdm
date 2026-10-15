import categoriesData from "@/data/mock/categories.json";
import type { Category } from "@/models/category";
import type { CategoryRepository } from "../contracts";

export class MockCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    return structuredClone(categoriesData as Category[]).sort((a, b) => a.order - b.order);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const found = (categoriesData as Category[]).find((category) => category.slug === slug);
    return found ? structuredClone(found) : null;
  }
}
