import productsData from "@/data/mock/products.json";
import type { Product } from "@/models/product";
import type { ProductRepository } from "../contracts";

export class MockProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return structuredClone(productsData as Product[]).sort((a, b) => a.order - b.order);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const found = (productsData as Product[]).find((product) => product.slug === slug);
    return found ? structuredClone(found) : null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const wanted = new Set(ids);
    return structuredClone((productsData as Product[]).filter((product) => wanted.has(product.id)));
  }
}
