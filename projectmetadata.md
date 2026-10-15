# Project Metadata — device masters (The Device Masters)

Blueprint for the device masters storefront. **Phase 1 is frontend only**: every page renders
from typed mock JSON through Model → Repository → Service → ViewModel → View, so the MySQL
and admin backend can be plugged in later without touching pages or components.

Keep this file updated as the source of truth for structure and rules.

---

## 1. Project identity

| Key | Value |
| --- | --- |
| Project name | `thedevicemaster` |
| Brand | device masters |
| Business | Computer, laptop and mobile shop with an in-house repair desk |
| Tagline | "Next-gen devices. Expert repair." |
| Currency | Pakistani rupee (PKR, shown as "PKR 1,000"), whole numbers |
| Facebook | https://www.facebook.com/p/The-Device-Masters-61573032122171/ |
| Primary CTAs | Shop now, Book a repair, Checkout |
| Dev URL | http://127.0.0.1:3120 (`APP_ORIGIN` must match) |
| Design source | claude.ai artifact `5ViivALkjU3gP4zeQQVAwU` (light: navy `#0a1a3f`, amber `#f9b21d`, Kumbh Sans + Geist Mono) |

---

## 2. Technology stack (Phase 1)

| Area | Choice | Notes |
| --- | --- | --- |
| Runtime | Node.js >= 20.9 | Blueprint target was 22.x; Next 16 runs on 20.9+ |
| Framework | Next.js 16.4, App Router, **Cache Components + Partial Prefetching** | Read `node_modules/next/dist/docs/` before writing code |
| UI | React 19 + TSX | No `.jsx` / `.js` app files |
| Language | TypeScript 5, `strict: true` | Alias `@/*` → `./src/*` |
| Styling | One native CSS file: `src/styles/globals.css` | Tokens in the first `:root` block; no Tailwind / CSS-in-JS |
| Icons | `lucide-react` | Mapped by name in `components/ui/Icon.tsx` |
| Validation | `zod` 4 | API input and form payloads |
| Server guard | `server-only` | Top of every server-only module |
| Tests | Node test runner via `tsx` (`scripts/run-tests.mjs`) | `tests/*.test.ts` |
| Formatting | Prettier 3 | |

Added later (Phase 2): `mysql2`, `nodemailer`, `sharp`, `@tanstack/react-query` (admin only).

### Cache Components rules that shape the code

- Dynamic routes export `generateStaticParams` (at least one param) and await `params`.
- `searchParams` is only read on `/shop` (`?q=`, inside Suspense); catalogue filtering is a client viewmodel
  calling `/api/getProductList`, seeded with server-rendered first-page data.
- Non-deterministic values (`new Date()`) live inside `"use cache"` functions (see `Footer.tsx`).
- `dynamicParams` is not supported; unknown slugs stream a `noindex` not-found page first.

---

## 3. Structure

```text
src/
├── app/                      Routes only (thin)
│   ├── layout.tsx            Root layout: CartProvider + SiteShell
│   ├── page.tsx              Home
│   ├── shop/                 page.tsx, [slug]/page.tsx (product detail)
│   ├── category/[slug]/      Category catalogue
│   ├── repair/               page.tsx, [slug]/page.tsx (service detail)
│   ├── offers/  contact/  checkout/
│   ├── api/[operation]/route.ts   Named-operation dispatcher (GET + POST)
│   ├── api/health/route.ts
│   └── not-found.tsx  robots.ts  sitemap.ts
├── components/               Presentation only
│   ├── layout/               SiteShell, Header, NavigationLinks, MobileMenu, Footer,
│   │                         AnnouncementBar, PageHero
│   ├── branding/ cart/ home/ shop/ repair/ offers/ forms/ content/ seo/ ui/
├── config/                   site.ts, navigation.ts, commerce.ts, seo.ts
├── data/mock/                products, categories, services, offers, pages (JSON)
├── hooks/                    useDebounce, useLocalStorage, useNavigation, useCountdown, useApiSubmit
├── lib/seo.ts                Metadata builders + JSON-LD (ComputerStore, Product, BreadcrumbList)
├── models/                   Types only
├── repositories/             contracts.ts + mock/* adapters
├── server/                   container.ts (composition root) + http/{operations,origin,respond}.ts
├── services/                 product, category, repair, offer, page, submission, order (+ errors)
├── styles/globals.css        ALL styling
├── utils/                    format, slug, http-client
└── viewmodels/               *.viewmodel.ts (server, React cache) and use*ViewModel.ts (client)
```

`.gitignore`, `.gitattributes`, `.env.example`, `AGENTS.md` / `CLAUDE.md` follow the original
blueprint. `public/fonts` holds the local variable fonts (Kumbh Sans, Geist Mono); `public/branding/logo.png` is the brand mark.

---

## 4. Architecture rules (keep these exactly)

Flow: **View → ViewModel → (API) → Service → Repository**

1. **Route files are thin.** Read params, call a viewmodel, `notFound()` if null, export metadata, render.
2. **Server pages never fetch their own API.** They call services through a viewmodel.
3. **Components are presentation.** No fetching, no business rules, no JSON imports.
4. **Services depend on repository interfaces** (`repositories/contracts.ts`).
5. **Only `server/container.ts` constructs adapters.** Swapping mock → MySQL happens there.
6. **Only repositories import `src/data/**`.** They return `structuredClone`d data.
7. **Zod validates all untrusted input** in the service layer and for API query params.
8. **Single API dispatcher** with named operations; `{ data }` on success, `{ error }` with status on failure.
9. **POST requests check `Origin` === `APP_ORIGIN`** (403 otherwise).
10. **`import "server-only"`** in `server/**`, server viewmodels and anything reading env vars.
11. **Models are types only.**
12. **All styling in `globals.css`**; use tokens, never hard-coded colours; honour `prefers-reduced-motion`.
13. **Local assets only**; `next/image` for content images with explicit sizes and alt text.
14. **No `any` without a reason; no default exports except where Next.js requires them.**
15. **No secrets in the client.** There are no `NEXT_PUBLIC_*` values in Phase 1.
16. **Never trust client prices.** Orders carry product ids and quantities; `OrderService` prices them.

### Naming

| Thing | Pattern | Example |
| --- | --- | --- |
| Component | `PascalCase.tsx`, named export | `components/shop/ProductCard.tsx` |
| Server viewmodel | `<domain>.viewmodel.ts`, wrapped in `cache()` | `getProductPageViewModel(slug)` |
| Client viewmodel | `use<Name>ViewModel.ts` with `"use client"` | `useCheckoutViewModel()` |
| Service | `<domain>.service.ts`, class | `ProductService` |
| Repository | `<domain>.repository.ts`, `Mock<Domain>Repository` / `Mysql<Domain>Repository` | |
| API operation | `get<Entity>List`, `get<Entity>BySlug`, `submit<Form>` | `getProductList`, `submitOrder` |
| CSS class | kebab-case, block-prefixed | `.product-card__name` |

---

## 5. Routes and API

| Route | Page | Data |
| --- | --- | --- |
| `/` | Home: hero + search, trust strip, offerings, categories, flash sale, featured, repair band, offers, booking | `pages.json`, products, categories, services, offers |
| `/shop`, `/shop/[slug]` | Catalogue (search, category, condition, pagination) / product detail | `products.json` |
| `/category/[slug]` | mobiles, laptops, computers, accessories, gadgets | `categories.json` |
| `/repair`, `/repair/[slug]` | Repair overview + booking / service detail | `services.json`, `pages.json#repair` |
| `/offers` | Codes + discounted devices | `offers.json` |
| `/contact` | Contact details + message form | `config/site.ts` |
| `/checkout` | Cart review, delivery, payment | cart (browser) |

```text
GET  /api/getProductList?search=&category=&condition=&page=&pageSize=   GET /api/getProductBySlug?slug=
GET  /api/getCategoryList          GET /api/getOfferList
GET  /api/getRepairServiceList     GET /api/getRepairServiceBySlug?slug=
POST /api/submitBooking            POST /api/submitContact          POST /api/submitOrder
GET  /api/health
```

---

## 6. Verification

- `npm run typecheck` — zero errors.
- `npm test` — pagination/filter/search, find by slug, no mutation of source data, Zod rejections,
  server-side order pricing.
- `npm run build` — standalone build succeeds.
- `node scripts/verify-routes.mjs` / `verify-navigation.mjs` — against a running server.

---

## 7. Phase 2 (backend) — plug-in points, do not build yet

| Add | Where | Touches pages/components? |
| --- | --- | --- |
| MySQL pool | `src/server/database/mysql.ts` | No |
| MySQL adapters | `src/repositories/mysql/*.repository.ts` implementing `contracts.ts` | No |
| Swap adapters | `src/server/container.ts` | No |
| Migrations | `database/migrations/001_*.sql …` | No |
| Admin (bookings + orders, status workflow) | `src/app/admin/**`, `components/admin/**` | No |
| Auth | `src/server/auth/*` — replace the demo PIN with hashed credentials and HTTP-only sessions | No |
| Email | `services/mail-notification.service.ts` via nodemailer | No |
| Deploy | `deploy/` systemd + Nginx | No |

The design mock-up stored bookings and orders in `localStorage` behind a PIN (`1234`). That is a
demo only and must not be carried over: Phase 2 stores them in MySQL behind real auth.
