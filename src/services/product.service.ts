import { z } from "zod";
import type { Product, ProductCondition } from "@/models/product";
import type { PageResult, ProductQuery } from "@/models/query";
import type { ProductRepository } from "@/repositories/contracts";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;

export const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(60).optional(),
  brand: z.string().trim().max(60).optional(),
  condition: z.enum(["new", "used", "refurbished"]).optional(),
  page: z.coerce.number().int().min(1).max(1000).optional(),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).optional(),
});

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  /** Search, filter and paginate the catalogue. Input is validated with Zod. */
  async list(query: ProductQuery = {}): Promise<PageResult<Product>> {
    const parsed = productQuerySchema.parse(query);
    const pageSize = parsed.pageSize ?? DEFAULT_PAGE_SIZE;
    const needle = parsed.search?.toLowerCase();

    const all = await this.repository.findAll();
    const matches = all.filter((product) => {
      if (parsed.category && product.category !== parsed.category) return false;
      if (parsed.brand && product.brand?.toLowerCase() !== parsed.brand.toLowerCase()) return false;
      if (parsed.condition && product.condition !== (parsed.condition as ProductCondition)) {
        return false;
      }
      if (needle && !`${product.name} ${product.spec}`.toLowerCase().includes(needle)) return false;
      return true;
    });

    const total = matches.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(parsed.page ?? 1, totalPages);
    const start = (page - 1) * pageSize;

    return { items: matches.slice(start, start + pageSize), total, page, pageSize, totalPages };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.repository.findBySlug(slug);
  }

  async listAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async listFeatured(limit = 8): Promise<Product[]> {
    const all = await this.repository.findAll();
    return all.filter((product) => product.featured).slice(0, limit);
  }

  /** Discounted products, biggest saving first. */
  async listOnSale(limit = 3): Promise<Product[]> {
    const all = await this.repository.findAll();
    const saving = (product: Product) => (product.oldPrice ?? product.price) - product.price;
    return all
      .filter((product) => product.oldPrice !== null && product.oldPrice > product.price)
      .sort((a, b) => saving(b) - saving(a))
      .slice(0, limit);
  }

  async listRelated(product: Product, limit = 4): Promise<Product[]> {
    const all = await this.repository.findAll();
    return all
      .filter((candidate) => candidate.category === product.category && candidate.id !== product.id)
      .slice(0, limit);
  }
}
