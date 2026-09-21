# Uttara (ಉತ್ತರ) — North Karnataka Food Brand Platform

> **Simple Oota. North Karnataka Soul.**  
> A production-ready modular monolith platform for a Bengaluru-based North Karnataka food brand featuring a centralized preparation kitchen and a network of nimble takeaway/service outlets.

---

## 🌾 The Business Model & Concept

- **Centralized Master Kitchen (Hub)**: High-discipline bulk cooking of traditional sorghum rottis, slow-simmered toor dal, stone-ground chutney powders, and daily rotating Kalyana Karnataka palyas under strict quality control. Dispatches in temperature-regulated containers twice daily.
- **Outlet Network (Spokes)**: Small footprint counters across Bengaluru (Indiranagar, Jayanagar, Malleshwaram, Koramangala — scalable to 20+ outlets). Outlets only receive, assemble, pack, and serve customer orders in 5–8 minutes.
- **The Core Oota**: Intentionally focused and disciplined:
  1. 3 Jolada Rotti / Chapati
  2. 2 Kalyana Karnataka Palyas (e.g. Yennegayi Badanekayi & Hesaru Kalu Usli, rotating daily)
  3. Steamed Sona Masoori Rice
  4. North Karnataka Bele Saaru
  5. 2 Chutney Powders (Shenga Pudi & Agasi Pudi)
  6. Fresh Thick Curd (Mosaru)

---

## 🏗️ Architecture & Monorepo Structure

```text
/Users/hemanthsa/food
├── packages/
│   └── shared/              # Shared TypeScript types, contracts, DTOs, & meal constants
├── apps/
│   ├── api/                 # Fastify modular monolith REST API
│   │   ├── prisma/          # PostgreSQL schema & rich seed data
│   │   ├── src/
│   │   │   ├── modules/     # auth, outlets, menu, orders, payments, loyalty, kitchen, staff, admin
│   │   │   ├── plugins/     # JWT auth, role guards, Prisma client
│   │   │   ├── app.ts       # Fastify app factory & error handler
│   │   │   └── server.ts    # Server entrypoint
│   │   └── tests/           # Automated pricing, coupon, and payment tests
│   └── web/                 # Next.js App Router, Tailwind CSS design system
│       ├── src/
│       │   ├── app/         # /, /menu, /outlets, /cart, /orders/[id], /account, /staff, /kitchen, /admin
│       │   ├── components/  # Design system UI library (Button, Modal, Card, OrderStatus, etc.)
│       │   └── context/     # Auth, Cart, and Toast providers
├── docker-compose.yml       # Turnkey PostgreSQL 16 Alpine container
├── package.json             # Root workspace orchestration
└── README.md
```

---

## 🎨 Visual Identity & Design System

- **Primary**: Deep Terracotta / Burnt Earth (`#9E472A`)
- **Secondary**: Muted Turmeric / Warm Ochre (`#D9822B`)
- **Background**: Warm Ivory (`#FAF7F2`)
- **Surface**: Soft Cream (`#F4EFEA`)
- **Text**: Deep Charcoal (`#1C1917`)
- **Accents**: Muted Leaf Green (`#4A6B53`), Dusty Indigo (`#3D4A5A`)
- **Subtle Motifs**: North Karnataka textile Ilkal-inspired geometric border accents.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ (tested on Node v25)
- **Docker** & **Docker Compose**

### 2. Start PostgreSQL Database
```bash
docker compose up -d
```
*Spins up PostgreSQL 16 container mapped to host port `5433`.*

### 3. Install Dependencies & Build Shared Contracts
```bash
npm install
npm run build --workspace=packages/shared
```

### 4. Initialize Database Schema & Seed Data
```bash
# Push Prisma schema to Postgres
npm run prisma:push --workspace=@uttara/api

# Run comprehensive seed script
npm run db:seed --workspace=@uttara/api
```

### 5. Run Automated Tests
```bash
npm run test --workspace=@uttara/api
```
*Validates server-side pricing calculations, takeaway vs dine-in packaging fees, coupon math, and payment provider HMAC SHA-256 signature verification.*

### 6. Run Development Servers
In separate terminals:
```bash
# Start Fastify Backend API (Port 4000)
npm run dev:api

# Start Next.js Frontend (Port 3000)
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Seeded Test Accounts (All 5 Roles)

| Role | Email | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@uttara.in` | `Uttara@2026` | `/admin` (Metrics, Palya rotation, Outlet CRUD) |
| **Kitchen Manager** | `kitchen@uttara.in` | `Uttara@2026` | `/kitchen` (Aggregated demand across 20 outlets, dispatches) |
| **Outlet Manager** | `manager.indiranagar@uttara.in` | `Uttara@2026` | `/staff` (Outlet status, live orders) |
| **Outlet Staff** | `staff.indiranagar@uttara.in` | `Uttara@2026` | `/staff` (Tablet counter mode, OTP verification) |
| **Customer** | `customer@uttara.in` | `Uttara@2026` | `/account` (245 Oota loyalty points, 1-tap reorder) |

*You can also use the 1-click **Instant Role Previews** buttons on the `/account` page.*

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Customer sign up + automatic 50 loyalty points bonus.
- `POST /api/auth/login` — Login with email or phone + password.
- `POST /api/auth/refresh` — Secure refresh token rotation.
- `GET /api/auth/me` — Authenticated profile + loyalty points balance.

### Outlets (`/api/outlets`)
- `GET /api/outlets` — List active Bengaluru outlets (supports `lat`, `lng` for Haversine distance calculation and search `q`).
- `GET /api/outlets/:idOrSlug` — Outlet details, opening hours check, and preparation time.

### Menu (`/api/menu`)
- `GET /api/menu/today` — Daily North Karnataka Oota, rotating daily palyas, allergens, and price.

### Orders (`/api/orders`)
- `POST /api/orders/calculate` — Server-side pricing preview (subtotal, packaging, coupon, 5% GST).
- `POST /api/orders` — Atomic order placement with unique `UTT-XXXX` token and 4-digit pickup OTP.
- `GET /api/orders/my-orders` — Customer past order history.
- `GET /api/orders/:idOrNumber` — Real-time order progress stepper.

### Payments (`/api/payments`)
- `POST /api/payments/create` — Payment gateway abstraction (Mock or Razorpay).
- `POST /api/payments/verify` — Idempotent verification, order status transition to `CONFIRMED`, and automatic loyalty points award.

### Staff Counter (`/api/staff`)
- `GET /api/staff/orders` — Live order queue (New, Preparing, Ready at Counter).
- `PATCH /api/staff/orders/:id/status` — 1-tap status transition.
- `POST /api/staff/orders/:id/verify-pickup` — Counter OTP verification.

### Central Kitchen (`/api/kitchen`)
- `GET /api/kitchen/dashboard` — Aggregated daily meal demand across all 20 outlets.
- `POST /api/kitchen/dispatch` — Batch dispatch logger.

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` — Executive metrics (Revenue, AOV, active outlets, top outlets).
- `POST /api/admin/daily-palya` — Global 1-click palya rotation across all counters.
- `POST /api/admin/outlets` — Launch new outlet counter.
