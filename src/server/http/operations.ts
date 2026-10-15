import "server-only";
import { z } from "zod";
import { container } from "@/server/container";
import { NotFoundError } from "@/services/errors";
import { productQuerySchema } from "@/services/product.service";

export interface OperationContext {
  searchParams: URLSearchParams;
  body: unknown;
}

export type OperationHandler = (context: OperationContext) => Promise<unknown>;

const slugSchema = z.object({ slug: z.string().trim().min(1).max(120) });

function queryObject(searchParams: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    if (value !== "") result[key] = value;
  }
  return result;
}

function orThrowNotFound<T>(value: T | null, label: string): T {
  if (value === null) throw new NotFoundError(`${label} not found`);
  return value;
}

export const getOperations: Record<string, OperationHandler> = {
  getProductList: async ({ searchParams }) =>
    container.products.list(productQuerySchema.parse(queryObject(searchParams))),

  getProductBySlug: async ({ searchParams }) => {
    const { slug } = slugSchema.parse(queryObject(searchParams));
    return orThrowNotFound(await container.products.findBySlug(slug), "Product");
  },

  getCategoryList: async () => container.categories.list(),

  getRepairServiceList: async () => container.repairs.list(),

  getRepairServiceBySlug: async ({ searchParams }) => {
    const { slug } = slugSchema.parse(queryObject(searchParams));
    return orThrowNotFound(await container.repairs.findBySlug(slug), "Repair service");
  },

  getOfferList: async () => container.offers.list(),
};

export const postOperations: Record<string, OperationHandler> = {
  submitBooking: async ({ body }) => container.submissions.submitBooking(body),
  submitContact: async ({ body }) => container.submissions.submitContact(body),
  submitOrder: async ({ body }) => container.orders.place(body),
};
