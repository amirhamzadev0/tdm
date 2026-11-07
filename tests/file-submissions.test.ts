import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { FileSubmissionRepository } from "../src/repositories/file/submission.repository";

const booking = {
  fullName: "Test User",
  phone: "03001234567",
  device: "iPhone 13",
  service: "Screen replacement",
  preferredAt: "2026-12-01T10:00",
  problem: "Cracked screen",
};

const order = {
  customer: {
    fullName: "Test User",
    phone: "03001234567",
    email: "",
    address: "Street 1",
    city: "Islamabad",
    area: "",
    notes: "",
  },
  shippingMethod: "standard" as const,
  paymentMethod: "cod" as const,
  paymentReference: "",
  lines: [{ productId: "p-06", name: "ThinkPad T480", unitPrice: 38500, quantity: 1 }],
  subtotal: 38500,
  shippingFee: 100,
  total: 38600,
};

async function tempDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), "tdm-submissions-"));
}

describe("FileSubmissionRepository", () => {
  it("numbers records in order and keeps them after a restart", async () => {
    const dir = await tempDir();
    const first = new FileSubmissionRepository(dir);
    assert.equal((await first.createBooking(booking)).id, "DM-1001");
    assert.equal((await first.createBooking(booking)).id, "DM-1002");
    assert.equal((await first.createOrder(order)).id, "OR-5001");

    // A brand new instance stands in for the server restarting.
    const second = new FileSubmissionRepository(dir);
    assert.equal((await second.createBooking(booking)).id, "DM-1003");
    assert.equal((await second.createOrder(order)).id, "OR-5002");

    const saved = JSON.parse(await fs.readFile(path.join(dir, "orders.json"), "utf8"));
    assert.equal(saved.length, 2);
    assert.equal(saved[0].id, "OR-5002");
    assert.equal(saved[0].status, "new");
  });

  it("does not lose records when several arrive at the same time", async () => {
    const dir = await tempDir();
    const repo = new FileSubmissionRepository(dir);
    const receipts = await Promise.all(Array.from({ length: 12 }, () => repo.createOrder(order)));

    assert.equal(new Set(receipts.map((record) => record.id)).size, 12);
    const saved = JSON.parse(await fs.readFile(path.join(dir, "orders.json"), "utf8"));
    assert.equal(saved.length, 12);
  });

  it("tells the owner about each new record", async () => {
    const dir = await tempDir();
    const messages: string[] = [];
    const repo = new FileSubmissionRepository(dir, async (text) => {
      messages.push(text);
    });
    await repo.createOrder(order);
    await repo.createBooking(booking);
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(messages.length, 2);
    assert.match(messages[0], /New order OR-5001/);
    assert.match(messages[0], /1 x ThinkPad T480/);
    assert.match(messages[0], /Total: PKR 38,600/);
    assert.match(messages[1], /New repair booking DM-1001/);
  });

  it("still saves the record when the owner alert fails", async () => {
    const dir = await tempDir();
    const original = console.error;
    console.error = () => undefined;
    try {
      const repo = new FileSubmissionRepository(dir, async () => {
        throw new Error("network down");
      });
      const record = await repo.createOrder(order);
      assert.equal(record.id, "OR-5001");
      const saved = JSON.parse(await fs.readFile(path.join(dir, "orders.json"), "utf8"));
      assert.equal(saved.length, 1);
    } finally {
      console.error = original;
    }
  });

  it("sets aside a damaged file instead of refusing new orders", async () => {
    const dir = await tempDir();
    await fs.writeFile(path.join(dir, "orders.json"), "{not json", "utf8");
    const original = console.error;
    console.error = () => undefined;
    try {
      const repo = new FileSubmissionRepository(dir);
      assert.equal((await repo.createOrder(order)).id, "OR-5001");
      const files = await fs.readdir(dir);
      assert.ok(files.some((name) => name.startsWith("orders.json.corrupt-")));
    } finally {
      console.error = original;
    }
  });
});
