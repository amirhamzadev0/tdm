"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { CartItem } from "@/models/order";
import type { Product } from "@/models/product";

const STORAGE_KEY = "dm_cart";
const EMPTY_CART: CartItem[] = [];
const MAX_QUANTITY = 20;

export type CartProduct = Pick<Product, "id" | "slug" | "name" | "price">;

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    item.quantity >= 1
  );
}

/** Cart state persisted in the browser, plus the open/closed state of the cart drawer. */
export function useCartViewModel() {
  const [stored, setStored] = useLocalStorage<CartItem[]>(STORAGE_KEY, EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);

  const items = useMemo(
    () => (Array.isArray(stored) ? stored.filter(isCartItem) : EMPTY_CART),
    [stored],
  );

  const add = useCallback(
    (product: CartProduct) => {
      setStored((previous) => {
        const list = Array.isArray(previous) ? previous.filter(isCartItem) : [];
        const existing = list.find((item) => item.productId === product.id);
        if (existing) {
          return list.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
              : item,
          );
        }
        return [
          ...list,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      });
      setIsOpen(true);
    },
    [setStored],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setStored((previous) =>
        (Array.isArray(previous) ? previous.filter(isCartItem) : [])
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(Math.max(quantity, 0), MAX_QUANTITY) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [setStored],
  );

  const remove = useCallback(
    (productId: string) => {
      setStored((previous) =>
        (Array.isArray(previous) ? previous : []).filter((item) => item.productId !== productId),
      );
    },
    [setStored],
  );

  const clear = useCallback(() => setStored(EMPTY_CART), [setStored]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    count,
    subtotal,
    isEmpty: items.length === 0,
    add,
    setQuantity,
    remove,
    clear,
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
  };
}

export type CartViewModel = ReturnType<typeof useCartViewModel>;
