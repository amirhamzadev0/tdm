"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      type="button"
      className="cart-button"
      onClick={open}
      aria-label={`Open cart, ${count} items`}
    >
      <ShoppingCart size={16} aria-hidden="true" />
      <span className="cart-button__label">Cart</span>
      <b className="cart-button__count">{count}</b>
    </button>
  );
}
