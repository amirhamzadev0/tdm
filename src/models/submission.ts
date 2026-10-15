import type { PaymentMethodId, ShippingMethodId } from "./order";

export interface BookingInput {
  fullName: string;
  phone: string;
  device: string;
  service: string;
  preferredAt: string;
  problem: string;
}

export interface ContactInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface OrderInput {
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
  items: { productId: string; quantity: number }[];
}

export type BookingStatus = "new" | "confirmed" | "done";

export interface BookingRecord extends BookingInput {
  id: string;
  status: BookingStatus;
  createdAt: string;
}

export interface ContactRecord extends ContactInput {
  id: string;
  createdAt: string;
}

export interface SubmissionReceipt {
  id: string;
  message: string;
}

export interface OrderReceipt extends SubmissionReceipt {
  total: number;
}
