import { shippingMethods } from "@/config/commerce";
import type { OrderLine } from "@/models/order";
import type { OrderReceipt } from "@/models/submission";
import type { ProductRepository, SubmissionRepository } from "@/repositories/contracts";
import { BadRequestError } from "./errors";
import { orderSchema } from "./submission.service";

export class OrderService {
  constructor(
    private readonly products: ProductRepository,
    private readonly submissions: SubmissionRepository,
  ) {}

  /**
   * Validates the order and prices it from the catalogue. Prices sent by the
   * browser are never trusted.
   */
  async place(input: unknown): Promise<OrderReceipt> {
    const data = orderSchema.parse(input);

    const quantities = new Map<string, number>();
    for (const item of data.items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    const found = await this.products.findByIds([...quantities.keys()]);
    if (found.length !== quantities.size) {
      throw new BadRequestError("Some items in your cart are no longer available.");
    }

    const lines: OrderLine[] = found.map((product) => ({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: quantities.get(product.id) ?? 1,
    }));
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const shipping = shippingMethods.find((method) => method.id === data.shippingMethod);
    const shippingFee = shipping?.fee ?? 0;

    const record = await this.submissions.createOrder({
      customer: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        area: data.area,
        notes: data.notes,
      },
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference,
      lines,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    });

    return {
      id: record.id,
      total: record.total,
      message: `Order ${record.id} placed. We will call you to confirm delivery.`,
    };
  }
}
