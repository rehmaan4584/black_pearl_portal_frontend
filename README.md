# Black Pearl Portal

Seller admin panel for **Black Pearl** — manage products, categories, sizes, colors, and customer orders. Changes here appear live on the [customer store](https://github.com/rehmaan4584/black_pearl_store_frontend).

**Live portal:** https://rehman-bp-portal.duckdns.org

## Architecture

```
Seller  ──►  Portal (this repo)  ──►  Black Pearl API  ──►  Store (buyers see updates)
```

## Tech stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** · Radix UI / shadcn-style components
- **react-hook-form** · **sonner** toasts
- JWT auth (cookie + `localStorage`, route guard via middleware)

## Features

| Page | Description |
|------|-------------|
| Dashboard | Overview with quick links |
| Products | List, create, edit, delete — variants with size, color, price, stock, images |
| Categories | CRUD + inline sub-category management |
| Sizes | CRUD — name, display order (used by product variants) |
| Colors | CRUD — name, hex code with swatch preview |
| Orders | View all orders, customer details, line items; mark `PAID` → `SHIPPED` → `DELIVERED` |

**Auth:** Seller register & login. Protected routes redirect to `/login` if no token.

**Product workflow:** Create product → add variants (size + color from lookup tables) → upload images per variant via Cloudinary (handled by API).

## Getting started

### Prerequisites

- Node.js 18+
- [Black Pearl backend](https://github.com/rehmaan4584/black_pearl_backend) running locally

### Setup

```bash
git clone https://github.com/rehmaan4584/black_pearl_portal_frontend.git
cd black_pearl_portal_frontend
npm install
```

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003/
```

```bash
npm run dev
```

Open **http://localhost:3000** (login required for dashboard routes).

> Run store on a different port if both frontends are needed simultaneously (e.g. `next dev -p 3001`).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## Project structure

```
app/
  (auth)/             # Login, register
  (dashboard)/        # Products, categories, sizes, colors, orders
components/
  layout/             # Sidebar, app shell
  products/           # ProductForm, variant tabs
services/             # API service layer (product, category, size, color, order)
lib/api.ts            # Base fetch + multipart upload helpers
proxy.ts              # Auth route guard
```

## API integration

```
Page → services/*.service.ts → lib/api.ts → Backend REST API
```

Seller-only endpoints use `Authorization: Bearer <token>`. Image uploads use `apiUpload()` (multipart FormData).

## Related repos

- [black_pearl_backend](https://github.com/rehmaan4584/black_pearl_backend) — NestJS REST API · [Live](https://rehman-bp-api.duckdns.org/api)
- [black_pearl_store_frontend](https://github.com/rehmaan4584/black_pearl_store_frontend) — Customer storefront · [Live](https://rehman-bp-store.duckdns.org)

## Author

Abdul Rehman
