import type { OrderRecord } from "@/models/order";
import type { BookingInput, BookingRecord, ContactInput, ContactRecord } from "@/models/submission";
import type { SubmissionRepository } from "../contracts";

const MAX_RECORDS = 1000;

function stamp(): string {
  return new Date().toISOString();
}

function pushBounded<T>(list: T[], record: T): void {
  list.unshift(record);
  if (list.length > MAX_RECORDS) list.length = MAX_RECORDS;
}

/** Phase 1 in-memory store. Records are lost on restart and nothing is emailed. */
export class MockSubmissionRepository implements SubmissionRepository {
  private readonly bookings: BookingRecord[] = [];
  private readonly contacts: ContactRecord[] = [];
  private readonly orders: OrderRecord[] = [];
  private bookingCounter = 1000;
  private contactCounter = 0;
  private orderCounter = 5000;

  async createBooking(input: BookingInput): Promise<BookingRecord> {
    const record: BookingRecord = {
      ...input,
      id: `DM-${++this.bookingCounter}`,
      status: "new",
      createdAt: stamp(),
    };
    pushBounded(this.bookings, record);
    return structuredClone(record);
  }

  async createContact(input: ContactInput): Promise<ContactRecord> {
    const record: ContactRecord = {
      ...input,
      id: `MSG-${++this.contactCounter}`,
      createdAt: stamp(),
    };
    pushBounded(this.contacts, record);
    return structuredClone(record);
  }

  async createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "status">): Promise<OrderRecord> {
    const record: OrderRecord = {
      ...order,
      id: `OR-${++this.orderCounter}`,
      status: "new",
      createdAt: stamp(),
    };
    pushBounded(this.orders, record);
    return structuredClone(record);
  }
}
