# device masters

Storefront and repair desk for a computer, laptop and mobile shop: buy new, used and
refurbished devices, book a repair, and check out with a cart.

**Phase 1 is frontend only.** Every page renders from typed mock JSON through the same
Model → Repository → Service → ViewModel → View layers, so a MySQL/admin backend can be
plugged in later without touching pages or components. See [projectmetadata.md](projectmetadata.md)
for the full structure and rules.

## Run

```bash
npm install
cp .env.example .env.local   # optional; defaults match the dev URL
npm run dev                  # http://127.0.0.1:3120
```

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm start` | Dev server / production server on `127.0.0.1:3120` |
| `npm run build` | Standalone production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Service and validation tests (Node test runner via `tsx`) |
| `npm run lint` | ESLint |
| `node scripts/verify-routes.mjs` | Every route returns 200, 404s and API errors behave (server must be running) |
| `node scripts/verify-navigation.mjs` | Header and footer links resolve (server must be running) |

## Architecture

```text
app/**/page.tsx (server)  ──►  viewmodels/*.viewmodel.ts  ──►  server/container.ts services  ──►  repositories (mock → mysql)
components/forms (client) ──►  viewmodels/use*ViewModel.ts ──►  utils/http-client.ts ──► /api/[operation] ──► service ──► repository
```

- Pages are thin: read params, call a viewmodel, `notFound()` if empty, render components.
- Only `src/server/container.ts` constructs repository adapters.
- Only `src/repositories/**` imports `src/data/**`.
- All styling lives in `src/styles/globals.css` (tokens in the first `:root` block).
- Fonts are local (`public/fonts`); there are no third-party runtime requests.

## Routes

`/` · `/shop` · `/shop/[slug]` · `/category/[slug]` · `/repair` · `/repair/[slug]` ·
`/offers` · `/contact` · `/checkout` · `/api/[operation]` · `/api/health`

## Things to fill in before launch

- Phone, email and address in `src/config/site.ts` (placeholders today).
- bKash / Nagad / bank account details in `src/config/commerce.ts` (placeholders today).
- Product, service and offer content in `src/data/mock/*.json`; product `image` is `null`
  until real photos are added to `public/assets/`.

## Notes

- **Submissions are in memory.** Bookings, messages and orders are kept in a bounded
  in-memory list and nothing is emailed until Phase 2.
- **Prices are re-checked on the server.** The browser cart sends product ids and quantities
  only; `OrderService` prices the order from the catalogue.
- **Unknown slugs** (`/shop/nope`) stream a not-found page with `noindex` on the first
  request and return a real `404` afterwards. This is how Next.js behaves with Cache
  Components; `dynamicParams = false` is not supported alongside it. If a strict first-hit
  `404` is needed, check the slug in `proxy.ts`.
- **Admin is Phase 2.** The design mock-up had a PIN-gated admin view; it is intentionally
  not built here (see `projectmetadata.md` §Phase 2).
