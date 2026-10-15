import "server-only";
import { MockCategoryRepository } from "@/repositories/mock/category.repository";
import { MockOfferRepository } from "@/repositories/mock/offer.repository";
import { MockPageRepository } from "@/repositories/mock/page.repository";
import { MockProductRepository } from "@/repositories/mock/product.repository";
import { MockRepairServiceRepository } from "@/repositories/mock/repair-service.repository";
import { MockSubmissionRepository } from "@/repositories/mock/submission.repository";
import { CategoryService } from "@/services/category.service";
import { OfferService } from "@/services/offer.service";
import { OrderService } from "@/services/order.service";
import { PageService } from "@/services/page.service";
import { ProductService } from "@/services/product.service";
import { RepairCatalogService } from "@/services/repair.service";
import { SubmissionService } from "@/services/submission.service";

/**
 * Composition root. This is the only file that constructs repository adapters,
 * so swapping the mock adapters for MySQL ones happens here and nowhere else.
 */
function createContainer() {
  const productRepository = new MockProductRepository();
  const categoryRepository = new MockCategoryRepository();
  const repairRepository = new MockRepairServiceRepository();
  const offerRepository = new MockOfferRepository();
  const pageRepository = new MockPageRepository();
  const submissionRepository = new MockSubmissionRepository();

  return {
    products: new ProductService(productRepository),
    categories: new CategoryService(categoryRepository),
    repairs: new RepairCatalogService(repairRepository),
    offers: new OfferService(offerRepository),
    pages: new PageService(pageRepository),
    submissions: new SubmissionService(submissionRepository),
    orders: new OrderService(productRepository, submissionRepository),
  };
}

export type Container = ReturnType<typeof createContainer>;

// One instance per module evaluation. It is deliberately not cached on globalThis: a cached
// container survives hot reloads and keeps serving stale service classes after code changes.
export const container: Container = createContainer();
