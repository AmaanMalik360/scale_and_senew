# Frontend Modules

Each section: what the module owns, then an **Interdependencies** list. The interdependency bullets exist because a change that looks safe in one module can silently break a flow in another.

---

## app-routes

**Owns:** `app/(shop)/` (home, `about/`, `category/`, `product/`, `signin/`, `signup/`, `account/orders/`, `privacy-policy/`, `terms-of-service/` — wrapped by `layout.tsx` with `DashboardWrapper`), `app/admin/(auth)/` (login) and `app/admin/(pages)/` (dashboard), `app/checkout/` (outside `(shop)`, own `CheckoutHeader`, **no** `DashboardWrapper`). Root `layout.tsx` is bare HTML only — no header/footer/cart logic.

**`DashboardWrapper`** (`dashboardWrapper.tsx`) wraps `DashboardLayout` (calls `useCartSync()`, dark-mode effect) inside `StoreProvider`; also wraps children in `AdminRedirectGuard` so an admin visiting the shop is auto-redirected to `/admin/categories`.

**Admin layout:** `(auth)/` wraps pages in `AdminAuthLayout` using `AdminRedirectGuard` (redirects already-admin users to `/admin/categories`); `(pages)/` wraps pages in `AdminPagesLayout` using `AdminAuthGuard` (redirects non-admins to `/admin/login`). Both load `admin.css`, the Lato font, and their own `StoreProvider`.

**Auth pages in `(shop)`:**

- `/signin` — `useAuth().login()` with email/password; supports `?redirect=` param; "Continue as guest" link.
- `/signup` — guest-to-user registration flow using `useAuth().register()`.

**Interdependencies:**
- **components/auth** — `AdminAuthGuard` and `AdminRedirectGuard` are applied inside the layout files (`(shop)/layout.tsx` via `DashboardWrapper`, `admin/(auth)` and `admin/(pages)` layouts), not in individual page files. Changing a layout's guard changes behavior for every page in that group at once.
- **state** — `(shop)`'s `DashboardWrapper` calls `useCartSync()` once per session. `checkout/` deliberately skips it — code added to `checkout/` must not assume cart hydration has already run.

---

## state

**Owns:** RTK Query APIs (`*-api.ts` — categories, products, attributes, attribute-values, users, cart, orders, addresses) and two persisted Redux slices (`auth-slice.ts`, `cart-slice.ts`). `base-api.ts` implements `baseQueryWithReauth`: on 401, silently calls `POST users/refresh`, retries once, else dispatches `logout()`. Tag types: `Categories`, `Users`, `Products`, `Attributes`, `Cart`.

**Auth state (`auth-slice.ts`):**

```typescript
AuthUser: { id, email?, name?, is_guest, created_at, updated_at?, guest_expires_at?, permissions? }
AuthState: { user: AuthUser | null, isAuthenticated: bool, isGuest: bool }
Actions: setCredentials, setGuestUser, updateUser, logout
```

`permissions` is populated only after login/register/me responses (backend includes it from the RBAC traversal).

**`useAuth` hook (`hooks/useAuth.ts`):**

```typescript
const { user, isAuthenticated, isGuest, isLoading, createGuestUser, login, register, logout, ensureUser } = useAuth()
```

- `createGuestUser()` → `POST /users/guest`, dispatches `setGuestUser`
- `login(credentials)` → `POST /users/login`, dispatches `setCredentials`
- `register(data)` → `POST /users/register` (as current guest), dispatches `setCredentials`
- `logout()` → `POST /users/logout`, dispatches `logout`; clears local state even on request failure
- `ensureUser()` — if not authenticated, creates a guest user; else returns `{ user }`

**Cart state (`cart-slice.ts`):**

```typescript
CartItem: { productId, title, price_amount, image, categoryName?, quantity }
CartState: { items: CartItem[] }
Actions: addToCart, removeFromCart, updateCartItemQuantity, clearCart, setCart, hydrateCart
```

- `addToCart` — increments quantity if the item already exists
- `hydrateCart(backendItems)` — per backend item, take `max(existing, backend)` qty if present, else add (merge, never subtract)
- `setCart(items)` — full replace, used for cross-tab sync via `StorageEvent`

**Cart API (`cart-api.ts`)** — all responses transform snake_case → camelCase and prepend `getImageUrl()` to image paths:

```typescript
useGetCartQuery()              providesTags: ["Cart"]
useAddCartItemMutation()       body: { product_id, quantity }
useUpdateCartItemMutation()    body: { quantity }   PATCH /cart/items/{productId}
useRemoveCartItemMutation()    DELETE /cart/items/{productId}
useClearCartMutation()         DELETE /cart
useSyncCartMutation()          POST /cart/sync  (no tag invalidation — silent background sync)
useReplaceCartMutation()       POST /cart/replace
```

**`useCartSync` hook (`hooks/useCartSync.ts`):** called once on app boot from `DashboardLayout` (inside `DashboardWrapper`); runs once per auth session (`hasHydrated` ref).

1. On `StorageEvent` (`persist:root`) — `setCart()` to sync across browser tabs.
2. When `isAuthenticated && backendCart` is first available — `dispatch(hydrateCart(backendItems))`, then find Redux items NOT in the backend cart and fire `syncCart(unsyncedItems)` silently (handles guest items added before login).

**Add-to-bag pattern (`ProductInfo.tsx`):** if unauthenticated, `createGuestUser()` first; then `dispatch(addToCart(...))` **optimistically**; then fire `addCartItem(...)` async, catching failures with a toast rather than rolling back the optimistic update.

**Redux persistence:** whitelist `["global", "auth", "cart"]` — cart survives page refresh. API cache state (`baseApi.reducerPath`) is NOT persisted (re-fetched on mount).

**Data fetching (RTK Query), by API:**

- **Categories:** `useGetCategoriesQuery({slug?, skip?, limit?})`, `useGetCategoryQuery`, CRUD mutations. `Category`: `{ id, name, slug, parent_id?, children: Category[], filterable_attributes: AttributeFilter[] | null }`.
- **Products:** `useGetProductsQuery(GetProductsParams)`, `useGetProductQuery(id)`, `useCreateProductMutation` (sends FormData/multipart; supports `attribute_value_ids[]` and `images[]`), `useUpdateProductMutation`, `useDeleteProductMutation`. `GetProductsParams`: `{ category_slug?, category_ids?, min_price?, max_price?, in_stock?, search?, skip?, limit?, sort_by?, attribute_value_ids? }`. `ProductWithCategory`: `{ id, title, description?, category_id?, price_amount, stock_quantity, sku?, images[], attributes?: ProductAttribute[], category?: Category }`.
- **Attributes:** `useGetAttributesQuery`, `useGetCategoryAttributesQuery(categoryId)` → `{ attributes: AttributeWithValues[] }`, CRUD + assign.
- **Attribute Values:** create/update/delete mutations.
- **Users:** guest, login, register, CRUD, me, refresh, logout.
- **Cart:** get, add, update, remove, clear, sync, replace (see above).
- **Orders:** customer and admin order endpoints.
- **Addresses:** list, create, delete.
- Images: `getImageUrl(path)` prepends `NEXT_PUBLIC_API_BASE`.

**Interdependencies:**
- **app-routes guards (via components/auth)** — guards read `isAuthenticated` / `isGuest` / `permissions` directly from `auth-slice`; `permissions` is only populated after login/register/me responses, which must include it from the backend.
- **components/shop (add-to-bag / cart UI)** — the cart pattern is: dispatch the Redux action **optimistically first**, then fire the RTK Query mutation; UI must never block on the network call before updating.
- **hooks/useCartSync** — the only consumer of `hydrateCart`/`syncCart`; merges always take `max(existing, incoming)` quantity, never subtract. Breaking this invariant can make guest-cart-to-login merges lose items.

---

## components/shop

**Owns:** `category/`, `product/`, `header/`, `footer/`, `content/`, `about/` — public storefront presentation.

**Category page (`app/(shop)/category/[...slug]/page.tsx`):**

- **URL-driven state:** pagination (`page`, `page_size`), sort (`sort_by`), and all filters are stored in URL search params.
- **Data source:** reads `categories` from the Redux store — no redundant fetch.
- **Category hooks (`hooks.ts`):** `flattenCategories(cats)` / `useFlatCategories(categories)` — flattens the nested tree; `buildCategoryPath(categories, current)` / `useCategoryPath(flat, current)` — builds the root→current breadcrumb array; `useChildCategories(currentCategory)` — direct children; `useSelectedSubcategoryIds(flat, slugs)` — converts subcategory slug selections to IDs for the API.
- **Filtering:** `filterConfig: FilterConfig[]` built from subcategory checkboxes, a price `radios_with_range`, and dynamic attribute filters sourced from `currentCategory.filterable_attributes`.
- **Attribute filter params:** each attribute uses its `name` as the URL key; values are attribute value IDs (numbers).
- **Products query:** uses `category_ids` if subcategories are selected, else `category_slug`; passes `min_price`/`max_price`, `attribute_value_ids[]`, `sort_by`, `skip`, `limit`.

**Filter types (`types/filters.ts`):** `CheckboxFilter` (multiple string values), `RadioFilter` (single value), `RadioWithRangeFilter` (stores `{ min?, max? }` as `min_{key}`/`max_{key}` URL params; `allowCustom` for a custom range input); `FilterConfig = CheckboxFilter | RadioFilter | RadioWithRangeFilter`.

**Category UI components (`components/category/`):** `CategoryHeader.tsx` (breadcrumb + subcategory chip nav), `FilterSortBar.tsx` (Sheet-based filter panel, draft state applied on "Apply", sort via Select), `ProductGrid.tsx` (2/3/4-col grid, image hover swap, `formatPrice`, skeleton loading), `Pagination.tsx` (standalone, page-size options).

**Product components (`components/product/`):** `ProductInfo.tsx` — add-to-bag flow (auto-creates guest user if unauthenticated, optimistic Redux dispatch, then async `addCartItem`; debounces rapid clicks via `useDebounce(trigger, 400)`; shows attributes filtered to `['material', 'accents', 'weight']`) and the **"Order via WhatsApp"** button (creates an order with `source: "whatsapp"`, then opens WhatsApp with a formatted message). Also: `ProductImageGallery.tsx`, `ImageZoom.tsx`, `ReviewProduct.tsx`, `ProductDescription.tsx`, `ProductDetailRow.tsx`.

**Header (`components/header/`):** `Header.tsx` → renders `<Navigation />` (sticky, z-50); `Navigation.tsx` — main nav with cart + auth; `ShoppingBag.tsx` — shopping bag drawer with its own "Order via WhatsApp" button; `CheckoutHeader.tsx` — used only on the checkout page.

**Price format:** minor units stored in DB; always displayed as `RsX.XX` via `formatPrice(minorUnits)` (`src/lib/currency.ts`, `Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR" })`) — used in `ProductGrid`, `ProductInfo`, and `ShoppingBag`.

**Interdependencies:**
- **state (categories-api)** — the category page reads categories from the Redux store; it does not and should not re-fetch them.
- **state (products-api, cart-api, orders-api)** — `ProductInfo.tsx` drives both the add-to-bag flow (cart-slice + cart-api) and the "Order via WhatsApp" flow (orders-api + `lib/whatsapp.ts`) from the same component; changing one flow's auth-bootstrapping (auto guest-user creation) affects the other since both start from the same unauthenticated-user check.

**Brand assets (historical migration note):** Product images were migrated from `frontend/Products Data` into `public/products/assets/*` (16 original jpegs) and `public/products/new-assets/*` (26 pngs); `Products Data/Hammad Cataloge.pdf` was intentionally excluded. Logo switched from legacy LINEA assets to `public/Scale & Senew.svg` in `Navigation.tsx`, `CheckoutHeader.tsx`, `Footer.tsx`. Static brand-content pages (`about/our-story`, `sustainability`, `size-guide`, `customer-care`, `store-locator`, `privacy-policy`, `terms-of-service`) were rewritten from jewelry/LINEA language to wallets/bags. Homepage sections using these assets: `FiftyFiftySection`, `ProductCarousel`, `LargeHero`, `OneThirdTwoThirdsSection`, `EditorialSection`. The current-state rule (always use `public/Scale & Senew.svg`, never reintroduce LINEA/jewelry copy) is enforced in `.devin/rules/frontend.md`.

---

## components/admin

**Owns:** DealPort admin UI — `sidebar/`, `navbar/`, `data-table/`, `cards/`, `dropdown/`, `modals/` (category/attribute/attribute-value forms, delete confirmation), product image upload.

**Design system (DealPort Admin):** Font Lato (`--font-lato`). Colors: Ocean Green `#4EA674` (brand primary), Cyprus `#023337` (brand secondary), Surf Crest `#C1E6BA`, Aqua Spring `#EAF8E7` (accent), Purple `#6467F2`, Success `#21C45D`, Pending `#F0D411`, Error `#EF4343`, Grey `#7C7C7C`. CSS classes: `admin-btn-primary`, `admin-btn-secondary`, `admin-icon-btn`, `admin-input`, `admin-card`.

**Component structure:** `sidebar/AdminSidebar.tsx` (collapsible nav, accordion), `navbar/AdminNavbar.tsx` (title derived from pathname), `data-table/` (reusable `DataTable`), `cards/CategoryCard.tsx`/`StatCard.tsx`, `dropdown/CategorySelectDropdown.tsx` (Radix Select, indented category tree), `products/ProductImageUpload.tsx` (drag-and-drop multi-image uploader; exports `ImageItem { id, file, preview }` and `ProductImageUploadProps`).

**Modals (`modals/`):** `Modal.tsx` (base, size sm/md/lg), `common/DeleteConfirmModal.tsx`, `categories/CategoryFormModal.tsx` (react-hook-form + zod; name, parent_id, attribute_ids), `attributes/AttributeFormModal.tsx`, `AttributeValueFormModal.tsx`. All exported from `modals/index.ts`.

**Admin pages:**

- `/admin/categories` → `[[...slug]]/page.tsx` — category grid + product `DataTable`; `CategoryFormModal` (create/edit) with attribute assignment.
- `/admin/categories/attributes` → `attributes/page.tsx` — Attributes `DataTable`.
- `/admin/categories/attributes/[id]` → `attributes/[id]/page.tsx` — AttributeValues `DataTable`.
- `/admin/products/add` → `products/add/page.tsx` — full product creation form (title, description, `price_amount` via `CurrencyField`, `stock_quantity` via `NumberField`, `sku` via `TextField`, `category_id` via `CategoryTreeSelectField`, `attribute_values` via `DynamicFieldGroup` keyed by attr name → value ID, images via `ProductImageUpload`). Category change resets `attribute_values`. Submits as multipart FormData via `useCreateProductMutation`.
- `/admin/products/[id]/edit` — edit page; same `CurrencyField`/`CategoryTreeSelectField`; images are read-only.
- `/admin/orders` → `orders/page.tsx` — order list with status tabs and customer search.
- `/admin/orders/[id]` → `orders/[id]/page.tsx` — order detail (status, items, address, shipment, notes).
- `/admin/login` → `(auth)/login/page.tsx` — admin login form.

**Interdependencies:**
- **components/form** — every admin create/edit screen is built from the shared field primitives, not bespoke inputs. A change to `CurrencyField`'s value contract (e.g. switching from minor units to decimal) breaks every admin price field simultaneously, not just one screen.
- **state** — each admin page/modal is wired to a specific mutation (categories-api, products-api, attributes-api, attribute-values-api). The backend's EAV 3-layer order dependency (attribute → value → category assignment) is a real constraint here too: creating a product's attribute values before the attribute is assigned to its category will silently produce no filterable attributes.

---

## components/form

**Owns:** Generic React Hook Form + Zod field primitives — `Form`, `FormFieldWrapper`, `TextField`, `TextAreaField`, `NumberField`, `CurrencyField` (minor-unit integer values), `SelectField`, `CategoryTreeSelectField`, `CheckboxGroupField`, `DynamicFieldGroup` (N selects driven by runtime descriptors; prunes stale keys when descriptors change, e.g. on category switch).

**Interdependencies:**
- **components/admin** — sole consumer. `DynamicFieldGroup`'s key-pruning is coupled to `CategoryTreeSelectField`'s selection changing within the same form — the two must stay wired together or stale attribute fields can resubmit.
- **backend `products & pricing` module** — `CurrencyField` assumes integer minor units matching the backend's `amount` convention. A unit mismatch here (e.g. sending decimals) is a cross-service bug, not a frontend-only one.

---

## components/auth

**Owns:** `AdminAuthGuard` (requires `isAuthenticated && !isGuest && permissions.includes("admin:access")`), `AdminRedirectGuard` (redirects already-admin users to `/admin/categories`), generic `AuthGuard` (`requireAuth`/`requireAdmin`/`redirectTo` props).

**Interdependencies:**
- **app-routes** — consumed exclusively from layout files (see `app-routes` module), never from individual pages directly.
- **state (auth-slice)** — guards are a pure read of Redux auth state; they perform no independent auth check or API call.

---

## components/ui

**Owns:** shadcn/ui primitives (`Button`, `Card`, `Dialog`, `Select`, `Checkbox`, `Radio Group`, `Accordion`, `Carousel`, `Textarea`, `Sonner`, etc.) — vendor components, no business logic. Low documentation priority; refer to shadcn/ui's own docs for individual component APIs.
