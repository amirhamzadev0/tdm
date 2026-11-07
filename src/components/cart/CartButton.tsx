"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      className="hbar__icon cart-button"
      onClick={open}
      aria-label={`Open cart, ${count} items`}
    >
      <ShoppingBag size={20} aria-hidden="true" />
      {count > 0 ? <b className="cart-button__count">{count}</b> : null}
    </button>
  );
}
