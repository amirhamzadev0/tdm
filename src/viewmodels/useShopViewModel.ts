"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product, ProductCondition } from "@/models/product";
import type { PageResult } from "@/models/query";
import { apiRequest } from "@/utils/http-client";

interface ShopViewModelOptions {
  initial: PageResult<Product>;
  /** When set, the category filter is fixed (category pages). */
  lockedCategory?: string;
  /** Search term the server used to render `initial`. */
  initialSearch?: string;
}

function queryKey(search: string, category: string, condition: string, page: number): string {
  return JSON.stringify([search, category, condition, page]);
}

/** Search, filter and pagination state for the product catalogue. */
export function useShopViewModel({
  initial,
  lockedCategory,
  initialSearch = "",
}: ShopViewModelOptions) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [category, setCategory] = useState(lockedCategory ?? "");
  const [condition, setCondition] = useState<ProductCondition | "">("");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput.trim(), 250);
  const key = queryKey(search, category, condition, page);

  const [entry, setEntry] = useState({
    key: queryKey(initialSearch.trim(), lockedCategory ?? "", "", 1),
    result: initial,
  });
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);

  useEffect(() => {
    if (entry.key === key) return;
    const controller = new AbortController();

    apiRequest<PageResult<Product>>("getProductList", {
      query: {
        search,
        category,
        condition,
        page,
        pageSize: initial.pageSize,
      },
      signal: controller.signal,
    })
      .then((result) => {
        setFailure(null);
        setEntry({ key, result });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setFailure({
          key,
          message: error instanceof Error ? error.message : "Could not load devices.",
        });
      });

    return () => controller.abort();
  }, [entry.key, key, search, category, condition, page, initial.pageSize]);

  const updateSearch = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const updateCategory = useCallback(
    (value: string) => {
      if (lockedCategory) return;
      setCategory(value);
      setPage(1);
    },
    [lockedCategory],
  );

  const updateCondition = useCallback((value: ProductCondition | "") => {
    setCondition(value);
    setPage(1);
  }, []);

  const failed = failure?.key === key;

  return {
    searchInput,
    category,
    condition,
    page,
    result: entry.result,
    isLoading: entry.key !== key && !failed,
    errorMessage: failed ? failure.message : null,
    setSearch: updateSearch,
    setCategory: updateCategory,
    setCondition: updateCondition,
    setPage,
  };
}
