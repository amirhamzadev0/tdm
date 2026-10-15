"use client";

import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/utils/format";
import { ButtonLink } from "../ui/Button";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { items, isEmpty, subtotal, isOpen, close, remove, setQuantity } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={close} aria-hidden="true" />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your cart">
        <div className="cart-drawer__header">
          <span>Your cart</span>
          <button type="button" className="icon-button" onClick={close} aria-label="Close cart">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="cart-drawer__lines">
          {isEmpty ? (
            <p className="cart-drawer__empty">Nothing here yet.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.productId} className="cart-line">
                  <div>
                    <Link href={`/shop/${item.slug}`} className="cart-line__name" onClick={close}>
                      {item.name}
                    </Link>
                    <div className="cart-line__price">{formatPrice(item.price)}</div>
                    <div className="cart-line__controls">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => remove(item.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-drawer__footer">
          <div className="cart-drawer__total">
            <span>Total</span>
            <b>{formatPrice(subtotal)}</b>
          </div>
          {isEmpty ? null : (
            <div onClick={close}>
              <ButtonLink href="/checkout" block>
                Checkout
              </ButtonLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
