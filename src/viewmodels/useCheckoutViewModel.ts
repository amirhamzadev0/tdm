"use client";

import { useState, type FormEvent } from "react";
import { paymentMethods, shippingMethods } from "@/config/commerce";
import { useApiSubmit } from "@/hooks/useApiSubmit";
import type { PaymentMethodId, ShippingMethodId } from "@/models/order";
import type { OrderReceipt } from "@/models/submission";
import type { CartViewModel } from "./useCartViewModel";

interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  notes: string;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  paymentReference: string;
}

const INITIAL_FORM: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  area: "",
  notes: "",
  shippingMethod: "standard",
  paymentMethod: "cod",
  paymentReference: "",
};

export function useCheckoutViewModel(cart: Pick<CartViewModel, "items" | "subtotal" | "clear">) {
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const { state, submit, reset } = useApiSubmit<OrderReceipt>("submitOrder");

  const shipping = shippingMethods.find((method) => method.id === form.shippingMethod);
  const payment = paymentMethods.find((method) => method.id === form.paymentMethod);
  const shippingFee = shipping?.fee ?? 0;

  const setField = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (state.status === "error") reset();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart.items.length === 0) return;

    const receipt = await submit({
      ...form,
      items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    });
    if (receipt) {
      cart.clear();
      setForm((current) => ({ ...current, notes: "", paymentReference: "" }));
    }
  };

  return {
    form,
    setField,
    onSubmit,
    state,
    isSubmitting: state.status === "submitting",
    shippingFee,
    total: cart.subtotal + shippingFee,
    requiresReference: payment?.requiresReference ?? false,
    paymentNote: payment?.note ?? "",
    fieldError: (field: keyof CheckoutForm) =>
      state.status === "error" ? state.issues[field] : undefined,
  };
}
