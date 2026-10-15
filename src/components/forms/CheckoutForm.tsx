"use client";

import Link from "next/link";
import { paymentMethods, shippingMethods } from "@/config/commerce";
import { useCheckoutViewModel } from "@/viewmodels/useCheckoutViewModel";
import { formatPrice } from "@/utils/format";
import { useCart } from "../cart/CartProvider";
import { Button, ButtonLink } from "../ui/Button";
import { TextAreaField, TextField } from "./Field";

export function CheckoutForm() {
  const cart = useCart();
  const vm = useCheckoutViewModel(cart);

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
      <div className="card checkout__panel">
        <h2 className="checkout__panel-title">Your cart is empty</h2>
        <p className="form__hint">Add a device to your cart to check out.</p>
        <div>
          <ButtonLink href="/shop">Browse devices</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form className="checkout" onSubmit={vm.onSubmit} noValidate>
      <div className="checkout__main">
        <section className="checkout__panel">
          <h2 className="checkout__panel-title">1 · Delivery details</h2>
          <div className="form__row">
            <TextField
              label="Full name"
              value={vm.form.fullName}
              onChange={(value) => vm.setField("fullName", value)}
              error={vm.fieldError("fullName")}
              autoComplete="name"
              required
            />
            <TextField
              label="Phone number"
              type="tel"
              value={vm.form.phone}
              onChange={(value) => vm.setField("phone", value)}
              error={vm.fieldError("phone")}
              autoComplete="tel"
              required
            />
          </div>
          <TextField
            label="Email (optional)"
            type="email"
            value={vm.form.email}
            onChange={(value) => vm.setField("email", value)}
            error={vm.fieldError("email")}
            autoComplete="email"
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

        <section className="checkout__panel">
          <h2 className="checkout__panel-title">2 · Delivery method</h2>
          {shippingMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              className={`option-button${vm.form.shippingMethod === method.id ? " option-button--selected" : ""}`}
              aria-pressed={vm.form.shippingMethod === method.id}
              onClick={() => vm.setField("shippingMethod", method.id)}
            >
              <span>
                <b>{method.name}</b>
                <span className="option-button__note">{method.note}</span>
              </span>
              <b>{method.fee ? formatPrice(method.fee) : "Free"}</b>
            </button>
          ))}
        </section>

        <section className="checkout__panel">
          <h2 className="checkout__panel-title">3 · Payment</h2>
          <div className="option-row">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`chip${vm.form.paymentMethod === method.id ? " chip--active" : ""}`}
                aria-pressed={vm.form.paymentMethod === method.id}
                onClick={() => vm.setField("paymentMethod", method.id)}
              >
                {method.name}
              </button>
            ))}
          </div>
          <p className="form__hint">{vm.paymentNote}</p>
          {vm.requiresReference ? (
            <TextField
              label="Transaction ID / reference"
              value={vm.form.paymentReference}
              onChange={(value) => vm.setField("paymentReference", value)}
              error={vm.fieldError("paymentReference")}
              required
            />
          ) : null}
        </section>
      </div>

      <aside className="order-summary" aria-label="Order summary">
        <h2 className="checkout__panel-title">Order summary</h2>
        {cart.items.map((item) => (
          <div key={item.productId} className="order-summary__line">
            <span>
              <Link href={`/shop/${item.slug}`}>{item.name}</Link> × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="order-summary__line">
          <span>Subtotal</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        <div className="order-summary__line">
          <span>Delivery</span>
          <span>{vm.shippingFee ? formatPrice(vm.shippingFee) : "Free"}</span>
        </div>
        <div className="order-summary__line order-summary__line--total">
          <span>Total</span>
          <span>{formatPrice(vm.total)}</span>
        </div>

        {vm.state.status === "error" ? (
          <div className="form__alert form__alert--error" role="alert">
            {vm.state.message}
          </div>
        ) : null}

        <Button type="submit" block disabled={vm.isSubmitting}>
          {vm.isSubmitting ? "Placing order…" : "Place order"}
        </Button>
      </aside>
    </form>
  );
}
