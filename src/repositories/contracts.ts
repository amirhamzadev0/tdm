import type { Category } from "@/models/category";
import type { HomeContent, RepairContent } from "@/models/content";
import type { Offer } from "@/models/offer";
import type { OrderRecord } from "@/models/order";
import type { Product } from "@/models/product";
import type { RepairService } from "@/models/repair-service";
import type { BookingInput, BookingRecord, ContactInput, ContactRecord } from "@/models/submission";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
}

export interface RepairServiceRepository {
  findAll(): Promise<RepairService[]>;
  findBySlug(slug: string): Promise<RepairService | null>;
}

export interface OfferRepository {
  findAll(): Promise<Offer[]>;
}

export interface PageRepository {
  getHome(): Promise<HomeContent>;
  getRepair(): Promise<RepairContent>;
}

export interface SubmissionRepository {
  createBooking(input: BookingInput): Promise<BookingRecord>;
  createContact(input: ContactInput): Promise<ContactRecord>;
  createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "status">): Promise<OrderRecord>;
}
