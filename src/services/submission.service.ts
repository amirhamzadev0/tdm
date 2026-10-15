import { z } from "zod";
import { paymentMethods } from "@/config/commerce";
import type { SubmissionReceipt } from "@/models/submission";
import type { SubmissionRepository } from "@/repositories/contracts";

const phone = z.string().trim().min(6, "Enter a valid phone number").max(40);
const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max);
const optionalText = (max: number) => z.string().trim().max(max).default("");

export const bookingSchema = z.object({
  fullName: requiredText("Name", 120),
  phone,
  device: requiredText("Device", 120),
  service: requiredText("Service", 120),
  preferredAt: requiredText("Preferred time", 40),
  problem: optionalText(2000),
});

export const contactSchema = z.object({
  fullName: requiredText("Name", 120),
  email: z.email("Enter a valid email address").max(200),
  phone: optionalText(40),
  subject: requiredText("Subject", 200),
  message: requiredText("Message", 5000),
});

export const orderSchema = z
  .object({
    fullName: requiredText("Name", 120),
    phone,
    email: z.union([z.literal(""), z.email("Enter a valid email address").max(200)]).default(""),
    address: requiredText("Address", 300),
    city: requiredText("City", 100),
    area: optionalText(100),
    notes: optionalText(500),
    shippingMethod: z.enum(["standard", "express", "pickup"]),
    paymentMethod: z.enum(["cod", "bkash", "nagad", "bank"]),
    paymentReference: optionalText(120),
    items: z
      .array(
        z.object({
          productId: z.string().trim().min(1).max(60),
          quantity: z.number().int().min(1).max(20),
        }),
      )
      .min(1, "Your cart is empty")
      .max(50),
  })
  .superRefine((value, ctx) => {
    const method = paymentMethods.find((candidate) => candidate.id === value.paymentMethod);
    if (method?.requiresReference && value.paymentReference === "") {
      ctx.addIssue({
        code: "custom",
        path: ["paymentReference"],
        message: "Enter the transaction ID or reference",
      });
    }
  });

export type BookingSchemaInput = z.input<typeof bookingSchema>;
export type OrderSchemaInput = z.input<typeof orderSchema>;

export class SubmissionService {
  constructor(private readonly repository: SubmissionRepository) {}

  async submitBooking(input: unknown): Promise<SubmissionReceipt> {
    const data = bookingSchema.parse(input);
    const record = await this.repository.createBooking(data);
    return {
      id: record.id,
      message: `Booking ${record.id} received. We will call you to confirm your slot.`,
    };
  }

  async submitContact(input: unknown): Promise<SubmissionReceipt> {
    const data = contactSchema.parse(input);
    const record = await this.repository.createContact(data);
    return { id: record.id, message: "Thanks — your message has been received." };
  }
}
