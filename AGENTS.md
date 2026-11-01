# Frontend — Scale & Sinew (Next.js)

## Role

Next.js 16 App Router storefront (public shop) and admin dashboard for a wallets/bags e-commerce brand. Talks to the FastAPI `backend/` over cookie-based JWT auth with RTK Query.

## Layout

```
frontend/src/
├── app/
│   ├── (shop)/      # Shop pages — layout has DashboardWrapper (Header/Footer, dark mode, useCartSync)
│   ├── admin/
│   │   ├── (auth)/  # Login — AdminRedirectGuard
│   │   └── (pages)/ # Admin dashboard — AdminAuthGuard
│   └── checkout/    # Outside (shop) — own CheckoutHeader, no DashboardWrapper
├── components/      # UI components (shop, admin, form, auth, ui, header, footer)
├── hooks/           # useAuth, useCartSync, useDebounce, use-toast, use-mobile
├── lib/             # getImageUrl, formatPrice, whatsapp.ts, etc.
├── state/           # Redux slices + RTK Query APIs
└── types/           # filters.ts, etc.
```

## Data flow & conventions

- RTK Query `baseApi`: `credentials: "include"`, `baseQueryWithReauth` retries once after a silent `POST /users/refresh` on 401, else dispatches `logout()`.
- Redux persist: `key: "root"`, whitelist `["global", "auth", "cart"]`. API cache state is NOT persisted.
- Tag types: `["Categories", "Users", "Products", "Attributes", "Cart"]`.
- Prices are minor units end-to-end; always render with `formatPrice()` (`src/lib/currency.ts`).

General React/Next.js style conventions are in `.windsurf/rules/frontend-development-rules.md`. Project-specific behavioral rules (route groups, guards, cart pattern, WhatsApp checkout, brand assets) are in `.devin/rules/frontend.md`.

## Feature modules

Ownership and cross-module coupling for `app-routes`, `state`, `components/shop`, `components/admin`, `components/form`, `components/auth`, and `components/ui` are documented in `agents/modules/index.md`. Read it before changing anything that touches more than one feature area.
