"use client";

import { Search } from "lucide-react";
import type { Category } from "@/models/category";
import type { Product, ProductCondition } from "@/models/product";
import type { PageResult } from "@/models/query";
import { useShopViewModel } from "@/viewmodels/useShopViewModel";
import { Button } from "../ui/Button";
import { ProductGrid } from "./ProductGrid";

interface ProductCatalogProps {
  initial: PageResult<Product>;
  categories: Category[];
  /** Fixes the category filter (used on category pages). */
  lockedCategory?: string;
  /** Search term the server used to render `initial`. */
  initialSearch?: string;
}

const conditionOptions: { value: ProductCondition | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

export function ProductCatalog({
  initial,
  categories,
  lockedCategory,
  initialSearch,
}: ProductCatalogProps) {
  const vm = useShopViewModel({ initial, lockedCategory, initialSearch });
  const { result } = vm;

  return (
    <div className="catalog">
      <div className="catalog__toolbar">
        <p className="catalog__count" aria-live="polite">
          {result.total} {result.total === 1 ? "device" : "devices"}
        </p>
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <span className="visually-hidden">Search devices</span>
          <input
            className="search-field__input"
            type="search"
            value={vm.searchInput}
            onChange={(event) => vm.setSearch(event.target.value)}
            placeholder="Search devices, brands, specs"
          />
        </label>
      </div>

      {lockedCategory ? null : (
        <div className="tab-row" role="group" aria-label="Category">
          <button
            type="button"
            className={`tab${vm.category === "" ? " tab--active" : ""}`}
            aria-pressed={vm.category === ""}
            onClick={() => vm.setCategory("")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`tab${vm.category === category.slug ? " tab--active" : ""}`}
              aria-pressed={vm.category === category.slug}
              onClick={() => vm.setCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <div className="chip-row chip-row--spaced" role="group" aria-label="Condition">
        <span className="chip-row__label">CONDITION</span>
        {conditionOptions.map((option) => (
          <button
            key={option.label}
            type="button"
            className={`chip${vm.condition === option.value ? " chip--active" : ""}`}
            aria-pressed={vm.condition === option.value}
            onClick={() => vm.setCondition(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {vm.errorMessage ? (
        <p className="catalog__status" role="alert">
          {vm.errorMessage}
        </p>
      ) : null}

      <div className="catalog__results" aria-busy={vm.isLoading}>
        {result.items.length > 0 ? (
          <ProductGrid products={result.items} />
        ) : (
          <p className="catalog__status">No devices match that search.</p>
        )}
      </div>

      {result.totalPages > 1 ? (
        <nav className="pagination" aria-label="Pagination">
          <Button
            variant="outline"
            size="small"
            disabled={result.page <= 1}
            onClick={() => vm.setPage(result.page - 1)}
          >
            Previous
          </Button>
          <span className="pagination__info">
            {result.page} / {result.totalPages}
          </span>
          <Button
            variant="outline"
            size="small"
            disabled={result.page >= result.totalPages}
            onClick={() => vm.setPage(result.page + 1)}
          >
            Next
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
