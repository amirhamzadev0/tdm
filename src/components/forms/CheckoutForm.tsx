"use client";

import { ChevronDown, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { paymentMethods, shippingMethods } from "@/config/commerce";
import { useCheckoutViewModel } from "@/viewmodels/useCheckoutViewModel";
import { formatPrice } from "@/utils/format";
import { useCart } from "../cart/CartProvider";
import { ButtonLink } from "../ui/Button";
import { TextAreaField, TextField } from "./Field";

type Checkout = ReturnType<typeof useCheckoutViewModel>;
type Cart = ReturnType<typeof useCart>;

function Summary({ cart, vm }: { cart: Cart; vm: Checkout }) {
  return (
    <div className="co__summary">
      <ul className="co__lines">
        {cart.items.map((item) => (
          <li key={item.productId} className="co__line">
            <span className="co__thumb">
              {item.image ? (
                <Image src={item.image} alt="" fill sizes="64px" className="co__thumb-image" />
              ) : (
                <ShoppingBag size={22} aria-hidden="true" />
              )}
              <b className="co__qty">{item.quantity}</b>
            </span>
            <Link href={`/shop/${item.slug}`} className="co__line-name">
              {item.name}
            </Link>
            <span className="co__line-price">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="co__totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(cart.subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{vm.shippingFee ? formatPrice(vm.shippingFee) : "Free"}</dd>
        </div>
        <div className="co__grand">
          <dt>Total</dt>
          <dd>{formatPrice(vm.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function CheckoutForm() {
  const cart = useCart();
  const vm = useCheckoutViewModel(cart);
  const failed = vm.state.status === "error";

  // After a failed submit, bring the first problem into view (and focus it) so the buyer
  // does not have to hunt for the red text, especially on a phone.
  useEffect(() => {
    if (!failed) return;
    const target =
      document.querySelector<HTMLElement>(".co [aria-invalid='true']") ??
      document.querySelector<HTMLElement>(".co .form__alert");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus({ preventScroll: true });
  }, [failed, vm.state]);

  if (vm.state.status === "success") {
    return (
      <div className="order-success" role="status">
        <div className="order-success__id">ORDER {vm.state.receipt.id}</div>
        <h2 className="order-success__title">Thank you. Order placed.</h2>
        <p>
          {vm.state.receipt.message} Total: <b>{formatPrice(vm.state.receipt.total)}</b>
        </p>
        <ButtonLink href="/shop" variant="ghost">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  if (cart.isEmpty) {
    return (
      <div className="co co--empty">
        <h2 className="co__title">Your cart is empty</h2>
        <p className="form__hint">Add a device to your cart to check out.</p>
        <div>
          <ButtonLink href="/shop">Browse devices</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form className="co" onSubmit={vm.onSubmit} noValidate>
      <details className="co__toggle">
        <summary>
          <span>
            <ShoppingBag size={18} aria-hidden="true" /> Show order summary
            <ChevronDown size={16} aria-hidden="true" />
          </span>
          <b>{formatPrice(vm.total)}</b>
        </summary>
        <Summary cart={cart} vm={vm} />
      </details>

      <div className="co__main">
        <section className="co__section">
          <h2 className="co__title">Contact</h2>
          <TextField
            label="Phone number"
            type="tel"
            value={vm.form.phone}
            onChange={(value) => vm.setField("phone", value)}
            error={vm.fieldError("phone")}
            autoComplete="tel"
            required
          />
          <TextField
            label="Email (optional)"
            type="email"
            value={vm.form.email}
            onChange={(value) => vm.setField("email", value)}
            error={vm.fieldError("email")}
            autoComplete="email"
          />
        </section>

        <section className="co__section">
          <h2 className="co__title">Delivery</h2>
          <TextField
            label="Full name"
            value={vm.form.fullName}
            onChange={(value) => vm.setField("fullName", value)}
            error={vm.fieldError("fullName")}
            autoComplete="name"
            required
          />
          <TextField
            label="House, road, street address"
            value={vm.form.address}
            onChange={(value) => vm.setField("address", value)}
            error={vm.fieldError("address")}
            autoComplete="street-address"
            required
          />
          <div className="form__row">
            <TextField
              label="City / District"
              value={vm.form.city}
              onChange={(value) => vm.setField("city", value)}
              error={vm.fieldError("city")}
              required
            />
            <TextField
              label="Area / Postcode"
              value={vm.form.area}
              onChange={(value) => vm.setField("area", value)}
              error={vm.fieldError("area")}
            />
          </div>
          <TextAreaField
            label="Delivery notes (landmark, preferred time)"
            rows={2}
            value={vm.form.notes}
            onChange={(value) => vm.setField("notes", value)}
            error={vm.fieldError("notes")}
          />
        </section>

        <section className="co__section">
          <h2 className="co__title">Shipping method</h2>
          <div className="co__options" role="radiogroup" aria-label="Shipping method">
            {shippingMethods.map((method) => {
              const selected = vm.form.shippingMethod === method.id;
              return (
                <label key={method.id} className="co__option" data-selected={selected}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={selected}
                    onChange={() => vm.setField("shippingMethod", method.id)}
                  />
                  <span className="co__radio" aria-hidden="true" />
                  <span className="co__option-text">
                    <b>{method.name}</b>
                    <small>{method.note}</small>
                  </span>
                  <b>{method.fee ? formatPrice(method.fee) : "Free"}</b>
                </label>
              );
            })}
          </div>
        </section>

        <section className="co__section">
          <h2 className="co__title">Payment</h2>
          <div className="co__options" role="radiogroup" aria-label="Payment method">
            {paymentMethods.map((method) => {
              const selected = vm.form.paymentMethod === method.id;
              return (
                <div key={method.id} className="co__option-group" data-selected={selected}>
                  <label className="co__option" data-selected={selected}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selected}
                      onChange={() => vm.setField("paymentMethod", method.id)}
                    />
                    <span className="co__radio" aria-hidden="true" />
                    <span className="co__option-text">
                      <b>{method.name}</b>
                    </span>
                  </label>
                  {selected ? (
                    <div className="co__option-detail">
                      <p>{method.note}</p>
                      {method.requiresReference ? (
                        <TextField
                          label="Transaction ID / reference"
                          value={vm.form.paymentReference}
                          onChange={(value) => vm.setField("paymentReference", value)}
                          error={vm.fieldError("paymentReference")}
                          required
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {vm.state.status === "error" ? (
          <div className="form__alert form__alert--error" role="alert">
            {vm.state.message}
          </div>
        ) : null}

        <button type="submit" className="co__submit" disabled={vm.isSubmitting}>
          {vm.isSubmitting ? "Placing order…" : "Place order"}
        </button>
      </div>

      <aside className="co__aside" aria-label="Order summary">
        <Summary cart={cart} vm={vm} />
      </aside>
    </form>
  );
}
