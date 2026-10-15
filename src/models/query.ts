import type { ProductCondition } from "./product";

export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductQuery extends ListQuery {
  category?: string;
  brand?: string;
  condition?: ProductCondition;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
