import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ZodError } from "zod";
import { MockProductRepository } from "../src/repositories/mock/product.repository";
import { MockRepairServiceRepository } from "../src/repositories/mock/repair-service.repository";
import { MockSubmissionRepository } from "../src/repositories/mock/submission.repository";
import { BadRequestError } from "../src/services/errors";
import { OrderService } from "../src/services/order.service";
import { ProductService } from "../src/services/product.service";
import { RepairCatalogService } from "../src/services/repair.service";
import {
  bookingSchema,
  contactSchema,
  SubmissionService,
} from "../src/services/submission.service";

function setup() {
  const productRepo = new MockProductRepository();
  const submissionRepo = new MockSubmissionRepository();
  return {
    productRepo,
    products: new ProductService(productRepo),
    repairs: new RepairCatalogService(new MockRepairServiceRepository()),
    submissions: new SubmissionService(submissionRepo),
    orders: new OrderService(productRepo, submissionRepo),
  };
}

describe("ProductService", () => {
  it("paginates the catalogue", async () => {
    const { products } = setup();
    const all = await products.listAll();
    const totalPages = Math.ceil(all.length / 5);

    const first = await products.list({ page: 1, pageSize: 5 });
    assert.equal(first.items.length, 5);
    assert.equal(first.total, all.length);
    assert.equal(first.totalPages, totalPages);

    const last = await products.list({ page: totalPages, pageSize: 5 });
    assert.equal(last.items.length, all.length - (totalPages - 1) * 5);
  });

  it("clamps an out-of-range page to the last page", async () => {
    const { products } = setup();
    const all = await products.listAll();
    const result = await products.list({ page: 99, pageSize: 5 });
    assert.equal(result.page, Math.ceil(all.length / 5));
  });

  it("filters by section inside a category", async () => {
    const { products } = setup();

    const parts = await products.list({ category: "laptops", subcategory: "parts", pageSize: 48 });
    assert.ok(parts.items.length > 0);
    assert.ok(parts.items.every((item) => item.category === "laptops"));
    assert.ok(parts.items.every((item) => item.subcategory === "parts"));

    // Products without a section count as devices.
    const devices = await products.list({
      category: "mobiles",
      subcategory: "devices",
      pageSize: 48,
    });
    assert.ok(devices.items.some((item) => item.slug === "iphone-13-128gb"));
    assert.ok(devices.items.every((item) => (item.subcategory ?? "devices") === "devices"));

    const everything = await products.list({ category: "mobiles", pageSize: 48 });
    const sections = ["devices", "accessories", "parts"];
    let counted = 0;
    for (const subcategory of sections) {
      counted += (await products.list({ category: "mobiles", subcategory, pageSize: 48 })).total;
    }
    assert.equal(counted, everything.total);
  });

  it("filters by category, condition and search text", async () => {
    const { products } = setup();

    const laptops = await products.list({ category: "laptops", pageSize: 48 });
    assert.ok(laptops.items.length > 0);
    assert.ok(laptops.items.every((item) => item.category === "laptops"));

    const used = await products.list({ condition: "used", pageSize: 48 });
    assert.ok(used.items.every((item) => item.condition === "used"));

    const search = await products.list({ search: "thinkpad" });
    assert.ok(search.items.some((item) => item.slug === "thinkpad-t480"));
    assert.ok(
      search.items.every((item) => `${item.name} ${item.spec}`.toLowerCase().includes("thinkpad")),
    );
  });

  it("filters by brand, case-insensitively", async () => {
    const { products } = setup();
    const apple = await products.list({ brand: "apple", pageSize: 48 });
    assert.ok(apple.items.length >= 3);
    assert.ok(apple.items.every((item) => item.brand === "Apple"));

    const laptops = await products.list({ category: "laptops", brand: "HP" });
    assert.ok(laptops.items.some((item) => item.slug === "hp-pavilion-15"));
    assert.ok(laptops.items.every((item) => item.category === "laptops" && item.brand === "HP"));
  });

  it("rejects invalid query input", async () => {
    const { products } = setup();
    await assert.rejects(() => products.list({ pageSize: 1000 }), ZodError);
  });

  it("finds a product by slug and returns null for unknown slugs", async () => {
    const { products } = setup();
    assert.equal((await products.findBySlug("macbook-air-m1"))?.name, "MacBook Air M1");
    assert.equal(await products.findBySlug("nope"), null);
  });

  it("only lists discounted products as on sale, biggest saving first", async () => {
    const { products } = setup();
    const sale = await products.listOnSale(3);
    assert.equal(sale.length, 3);
    assert.ok(sale.every((item) => item.oldPrice !== null && item.oldPrice > item.price));
    const savings = sale.map((item) => (item.oldPrice ?? 0) - item.price);
    assert.deepEqual(
      savings,
      [...savings].sort((a, b) => b - a),
    );
  });

  it("does not let callers mutate the source data", async () => {
    const { products } = setup();
    const first = await products.findBySlug("macbook-air-m1");
    assert.ok(first);
    first.name = "Tampered";
    first.body.length = 0;

    const second = await products.findBySlug("macbook-air-m1");
    assert.equal(second?.name, "MacBook Air M1");
    assert.ok((second?.body.length ?? 0) > 0);
  });
});

describe("RepairCatalogService", () => {
  it("lists services in order and finds by slug", async () => {
    const { repairs } = setup();
    const list = await repairs.list();
    assert.equal(list.length, 6);
    assert.equal(list[0]?.slug, "screen-replacement");
    assert.equal((await repairs.findBySlug("motherboard-repair"))?.title, "Motherboard repair");
  });
});

describe("validation", () => {
  it("rejects a contact message with an invalid email", () => {
    const result = contactSchema.safeParse({
      fullName: "Sam",
      email: "not-an-email",
      subject: "Hello",
      message: "Hi",
    });
    assert.equal(result.success, false);
  });

  it("rejects a booking with missing fields", () => {
    const result = bookingSchema.safeParse({ fullName: "Sam" });
    assert.equal(result.success, false);
  });

  it("asks for a description when the service is Other", () => {
    const base = {
      fullName: "Sam",
      phone: "03001234567",
      device: "iPhone 13",
      service: "Other",
      preferredAt: "2026-12-01T10:00",
    };

    const missing = bookingSchema.safeParse({ ...base, problem: "" });
    assert.equal(missing.success, false);
    assert.deepEqual(missing.error?.issues[0]?.path, ["problem"]);

    assert.equal(bookingSchema.safeParse({ ...base, problem: "Speaker crackles" }).success, true);
    assert.equal(
      bookingSchema.safeParse({ ...base, service: "Screen replacement", problem: "" }).success,
      true,
    );
  });

  it("accepts a complete booking and returns a receipt", async () => {
    const { submissions } = setup();
    const receipt = await submissions.submitBooking({
      fullName: "Sam Rahman",
      phone: "01711111111",
      device: "iPhone 13",
      service: "Screen replacement",
      preferredAt: "2026-11-01T11:00",
      problem: "Cracked screen",
    });
    assert.match(receipt.id, /^DM-\d+$/);
  });
});

describe("OrderService", () => {
  const customer = {
    fullName: "Sam Rahman",
    phone: "01711111111",
    address: "House 1, Road 2",
    city: "Dhaka",
  };

  it("prices the order from the catalogue and adds shipping", async () => {
    const { orders, productRepo } = setup();
    const [charger] = await productRepo.findByIds(["p-13"]);
    assert.ok(charger);

    const receipt = await orders.place({
      ...customer,
      shippingMethod: "express",
      paymentMethod: "cod",
      items: [{ productId: "p-13", quantity: 2 }],
    });
    assert.equal(receipt.total, charger.price * 2 + 250);
    assert.match(receipt.id, /^OR-\d+$/);
  });

  it("requires a payment reference for bank transfer", async () => {
    const { orders } = setup();
    await assert.rejects(
      () =>
        orders.place({
          ...customer,
          shippingMethod: "pickup",
          paymentMethod: "bank",
          items: [{ productId: "p-13", quantity: 1 }],
        }),
      ZodError,
    );
  });

  it("rejects unknown products and empty carts", async () => {
    const { orders } = setup();
    await assert.rejects(
      () =>
        orders.place({
          ...customer,
          shippingMethod: "standard",
          paymentMethod: "cod",
          items: [{ productId: "does-not-exist", quantity: 1 }],
        }),
      BadRequestError,
    );
    await assert.rejects(
      () =>
        orders.place({
          ...customer,
          shippingMethod: "standard",
          paymentMethod: "cod",
          items: [],
        }),
      ZodError,
    );
  });
});
