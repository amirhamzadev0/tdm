"use client";

import { Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/utils/format";
import { useCart } from "../cart/CartProvider";

interface ProductActionsProps {
  product: { id: string; slug: string; name: string; price: number; image?: string | null };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { add, close } = useCart();
  const router = useRouter();

  return (
    <div className="pdp__actions">
      <button
        type="button"
        className="pdp__buy"
        onClick={() => {
          add(product);
          close();
          router.push("/checkout");
        }}
      >
        <ShoppingCart size={24} aria-hidden="true" />
        Buy Now
      </button>
      <button type="button" className="pdp__add" onClick={() => add(product)}>
        <Plus size={22} aria-hidden="true" />
        Add to cart
      </button>
    </div>
  );
}

/** Price and buttons pinned to the bottom of the screen on phones, so Buy Now is always in reach. */
export function ProductStickyBar({ product }: ProductActionsProps) {
  const { add, close } = useCart();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  // Slide away once the footer is on screen so the bar never covers it.
  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pdp-sticky" role="region" aria-label="Buy this product" data-hidden={hidden}>
      <span className="pdp-sticky__price">{formatPrice(product.price)}</span>
      <button type="button" className="pdp-sticky__add" onClick={() => add(product)}>
        <ShoppingCart size={18} aria-hidden="true" />
        Add
      </button>
      <button
        type="button"
        className="pdp-sticky__buy"
        onClick={() => {
          add(product);
          close();
          router.push("/checkout");
        }}
      >
        Buy Now
      </button>
    </div>
  );
}
