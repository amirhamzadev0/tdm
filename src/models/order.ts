export type ShippingMethodId = "standard" | "express" | "pickup";
export type PaymentMethodId = "cod" | "bkash" | "nagad" | "bank";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  note: string;
  fee: number;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  note: string;
  requiresReference: boolean;
}

/** Snapshot of a product held in the browser cart. Prices are re-checked on the server. */
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered";

export interface OrderLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    area: string;
    notes: string;
  };
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  paymentReference: string;
  lines: OrderLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
}
