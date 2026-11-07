import { promises as fs } from "node:fs";
import path from "node:path";
import { paymentMethods, shippingMethods } from "@/config/commerce";
import type { OrderRecord } from "@/models/order";
import type { BookingInput, BookingRecord, ContactInput, ContactRecord } from "@/models/submission";
import { formatPrice } from "@/utils/format";
import type { SubmissionRepository } from "../contracts";

type Kind = "orders" | "bookings" | "messages";
type Notify = (text: string) => Promise<void>;

function stamp(): string {
  return new Date().toISOString();
}

function describeOrder(order: OrderRecord): string {
  const shipping = shippingMethods.find((method) => method.id === order.shippingMethod);
  const payment = paymentMethods.find((method) => method.id === order.paymentMethod);
  const lines = order.lines.map(
    (line) => `  ${line.quantity} x ${line.name} (${formatPrice(line.unitPrice)})`,
  );
  const { customer } = order;
  return [
    `New order ${order.id}`,
    `${customer.fullName} - ${customer.phone}${customer.email ? ` - ${customer.email}` : ""}`,
    `${customer.address}, ${customer.city}${customer.area ? `, ${customer.area}` : ""}`,
    customer.notes ? `Notes: ${customer.notes}` : "",
    "Items:",
    ...lines,
    `Shipping: ${shipping?.name ?? order.shippingMethod} (${formatPrice(order.shippingFee)})`,
    `Payment: ${payment?.name ?? order.paymentMethod}${order.paymentReference ? ` - ref ${order.paymentReference}` : ""}`,
    `Total: ${formatPrice(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function describeBooking(booking: BookingRecord): string {
  return [
    `New repair booking ${booking.id}`,
    `${booking.fullName} - ${booking.phone}`,
    `Device: ${booking.device}`,
    `Service: ${booking.service}`,
    `Preferred time: ${booking.preferredAt}`,
    booking.problem ? `Problem: ${booking.problem}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function describeContact(message: ContactRecord): string {
  return [
    `New message ${message.id}`,
    `${message.fullName} - ${message.email}${message.phone ? ` - ${message.phone}` : ""}`,
    `Subject: ${message.subject}`,
    message.message,
  ].join("\n");
}

/**
 * Stores orders, repair bookings and contact messages as JSON files in `dir`, so they
 * survive restarts. Writes are queued one at a time so two customers submitting together
 * never overwrite each other. An optional `notify` callback tells the owner about each new
 * record; it never blocks or fails a customer's submission.
 */
export class FileSubmissionRepository implements SubmissionRepository {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly dir: string,
    private readonly notify?: Notify,
  ) {}

  private filePath(kind: Kind): string {
    return path.join(this.dir, `${kind}.json`);
  }

  private async read<T>(kind: Kind): Promise<T[]> {
    const file = this.filePath(kind);
    let text: string;
    try {
      text = await fs.readFile(file, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    try {
      const parsed: unknown = JSON.parse(text);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      // Keep the unreadable file for inspection and start a fresh list instead of
      // refusing every new order.
      await fs.rename(file, `${file}.corrupt-${Date.now()}`);
      console.error(`[submissions] ${file} was not valid JSON; moved it aside.`);
      return [];
    }
  }

  private async write(kind: Kind, list: unknown[]): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    const file = this.filePath(kind);
    const temp = `${file}.tmp`;
    await fs.writeFile(temp, JSON.stringify(list, null, 2), "utf8");
    await fs.rename(temp, file);
  }

  /** Adds a record with the next id for its prefix, newest first. */
  private append<T extends { id: string }>(
    kind: Kind,
    prefix: string,
    firstNumber: number,
    build: (id: string) => T,
    describe: (record: T) => string,
  ): Promise<T> {
    const run = this.queue.then(async () => {
      const list = await this.read<T>(kind);
      const highest = list.reduce((max, record) => {
        const value = Number(record.id.split("-")[1]);
        return Number.isFinite(value) ? Math.max(max, value) : max;
      }, firstNumber - 1);
      const record = build(`${prefix}-${highest + 1}`);
      list.unshift(record);
      await this.write(kind, list);
      return record;
    });
    this.queue = run.catch(() => undefined);

    return run.then((record) => {
      if (this.notify) {
        this.notify(describe(record)).catch((error: unknown) => {
          console.error("[submissions] notification failed:", error);
        });
      }
      return structuredClone(record);
    });
  }

  createBooking(input: BookingInput): Promise<BookingRecord> {
    return this.append<BookingRecord>(
      "bookings",
      "DM",
      1001,
      (id) => ({ ...input, id, status: "new", createdAt: stamp() }),
      describeBooking,
    );
  }

  createContact(input: ContactInput): Promise<ContactRecord> {
    return this.append<ContactRecord>(
      "messages",
      "MSG",
      1,
      (id) => ({ ...input, id, createdAt: stamp() }),
      describeContact,
    );
  }

  createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "status">): Promise<OrderRecord> {
    return this.append<OrderRecord>(
      "orders",
      "OR",
      5001,
      (id) => ({ ...order, id, status: "new", createdAt: stamp() }),
      describeOrder,
    );
  }
}
