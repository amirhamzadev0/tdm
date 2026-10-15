// Verifies every public route and the API contract against a running server.
// Usage: npm run dev (or npm start) in one terminal, then: node scripts/verify-routes.mjs
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3120";
const ORIGIN = process.env.APP_ORIGIN ?? BASE;

const routes = [
  "/",
  "/shop",
  "/offers",
  "/repair",
  "/contact",
  "/checkout",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health",
  ...[
    "mobiles",
    "laptops",
    "computers",
    "accessories",
    "gadgets",
  ].map((slug) => `/category/${slug}`),
  ...[
    "screen-replacement",
    "battery-replacement",
    "keyboard-trackpad",
    "ssd-ram-upgrade",
    "software-virus-fix",
    "motherboard-repair",
  ].map((slug) => `/repair/${slug}`),
  "/shop/iphone-13-128gb",
  "/shop/macbook-air-m1",
  "/shop/thinkpad-t480",
];

let failures = 0;
function check(name, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

async function status(path, init) {
  const response = await fetch(BASE + path, { redirect: "manual", ...init });
  return response.status;
}

for (const route of routes) {
  const code = await status(route);
  check(`GET ${route} -> 200`, code === 200, `got ${code}`);
}

check("GET /no-such-page -> 404", (await status("/no-such-page")) === 404);

// With Cache Components the first request for an unknown dynamic slug streams as 200 with a
// noindex tag (Next then caches the 404). Accept either, but never an indexable 200.
for (const path of ["/shop/no-such-product", "/category/no-such-category", "/repair/no-such-service"]) {
  const response = await fetch(BASE + path);
  const body = response.status === 404 ? "" : await response.text();
  check(
    `GET ${path} -> 404 or noindex`,
    response.status === 404 || (response.status === 200 && /name="robots"[^>]*noindex/.test(body)),
    `got ${response.status}`,
  );
}
check("GET /api/getNothing -> 404", (await status("/api/getNothing")) === 404);
check("GET /api/getProductList?pageSize=9999 -> 400", (await status("/api/getProductList?pageSize=9999")) === 400);
check("GET /api/getProductBySlug without slug -> 400", (await status("/api/getProductBySlug")) === 400);

const list = await fetch(`${BASE}/api/getProductList?category=laptops&pageSize=2`).then((r) => r.json());
check(
  "GET /api/getProductList filters and paginates",
  list.data?.items?.length === 2 && list.data.items.every((p) => p.category === "laptops"),
);

const booking = {
  fullName: "Test User",
  phone: "01700000000",
  device: "iPhone 13",
  service: "Screen replacement",
  preferredAt: "2026-11-01T11:00",
  problem: "",
};
const post = (path, body, origin = ORIGIN) =>
  fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) },
    body: JSON.stringify(body),
  });

check("POST /api/submitBooking valid -> 201", (await post("/api/submitBooking", booking)).status === 201);
check(
  "POST /api/submitBooking invalid -> 400",
  (await post("/api/submitBooking", { fullName: "x" })).status === 400,
);
check(
  "POST /api/submitBooking from wrong origin -> 403",
  (await post("/api/submitBooking", booking, "https://evil.example")).status === 403,
);
check(
  "POST /api/submitBooking without origin -> 403",
  (await post("/api/submitBooking", booking, "")).status === 403,
);
check(
  "POST /api/submitOrder prices from the catalogue",
  await post("/api/submitOrder", {
    fullName: "Test User",
    phone: "01700000000",
    address: "House 1",
    city: "Dhaka",
    shippingMethod: "pickup",
    paymentMethod: "cod",
    items: [{ productId: "p-15", quantity: 1 }],
  })
    .then((r) => r.json())
    .then((body) => body.data?.total === 900),
);

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
