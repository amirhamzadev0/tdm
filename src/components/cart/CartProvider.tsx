"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCartViewModel, type CartViewModel } from "@/viewmodels/useCartViewModel";

const CartContext = createContext<CartViewModel | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCartViewModel();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCart(): CartViewModel {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
