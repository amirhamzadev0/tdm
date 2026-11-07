"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
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
            <div className="cart-drawer__empty">
              <ShoppingBag size={40} aria-hidden="true" />
              <p>Your cart is empty.</p>
              <div onClick={close}>
                <ButtonLink href="/shop">Browse devices</ButtonLink>
              </div>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.productId} className="cart-line">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="cart-line__media"
                    onClick={close}
                    aria-label={item.name}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="72px"
                        className="cart-line__image"
                      />
                    ) : (
                      <ShoppingBag size={22} aria-hidden="true" />
                    )}
                  </Link>
                  <div className="cart-line__body">
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
                  <div className="cart-line__side">
                    <b>{formatPrice(item.price * item.quantity)}</b>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => remove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isEmpty ? null : (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Subtotal</span>
              <b>{formatPrice(subtotal)}</b>
            </div>
            <p className="cart-drawer__note">Delivery is added at checkout.</p>
            <div onClick={close}>
              <ButtonLink href="/checkout" block>
                Checkout
              </ButtonLink>
            </div>
            <button type="button" className="cart-drawer__continue" onClick={close}>
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
