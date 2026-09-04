# Flowmetrics 📊

> Modern Team Productivity & Analytics SaaS Platform for Remote and Hybrid Teams.

Flowmetrics provides engineering and product teams with deep insights into workload balance, project velocity, time distribution, and data-driven workflow optimizations.

---

## 🏗️ Repository Architecture

This project is structured as an interview-friendly, production-ready monorepo using **npm workspaces**:

```
flowmetrics-fullstack/
├── frontend/                   # Next.js 15+ App Router application (Client)
│   ├── src/
│   │   ├── app/                # App Router pages and layouts
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Client utilities & API client
│   │   └── types/              # TypeScript interfaces (API contracts & Pricing)
│   ├── public/                 # Static assets
│   ├── .env.example            # Frontend environment variables template
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS theme configuration
│   └── tsconfig.json           # Frontend TypeScript configuration
│
├── backend/                    # Express + Node.js API (Server)
│   ├── src/
│   │   ├── config/             # Environment & Mongoose database configuration
│   │   ├── controllers/        # Route handlers (auth, pricing, future blog)
│   │   ├── middleware/         # Error handler, auth, role & rate limiting
│   │   ├── models/             # Mongoose schemas (User, PricingPlan, future Blog)
│   │   ├── routes/             # Express API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── scripts/            # Seed and verification test suites
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # Backend TypeScript interfaces & contracts
│   │   ├── utils/              # JWT and cryptography helpers
│   │   ├── app.ts              # Express application factory
│   │   └── server.ts           # Server entrypoint and lifecycle
│   ├── .env.example            # Backend environment variables template
│   ├── tsconfig.json           # Backend TypeScript configuration
│   └── package.json
│
├── package.json                # Root package.json managing workspaces
├── .gitignore                  # Monorepo-wide Git ignore rules
└── README.md                   # Project documentation
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables with custom dark SaaS palette
- **Icons**: Lucide React
- **Animations**: Framer Motion / Motion
- **Form Handling & Validation**: React Hook Form, Zod
- **Notifications**: Sonner
- **Data Visualization**: Recharts
- **Content Editor**: TipTap (Blog admin)

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database / ODM**: MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Security & Rate Limiting**: express-rate-limit, CORS

### Deployment Targets
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🔐 Authentication & Role Authorization (Milestone 3)

Flowmetrics implements a secure authentication and role-based authorization system tailored for B2B SaaS management:

### 1. Dual-Layer Route Protection
- **`authenticate` middleware**: Extracts Bearer token from `Authorization` header, verifies the signature using `JWT_SECRET`, decodes the payload, and attaches `req.user`. Missing or invalid tokens return **HTTP 401**.
- **`requireAdmin` middleware**: Verifies `req.user.role === 'admin'`. A valid JWT alone **never** grants administrative privileges. Non-admin users are rejected with **HTTP 403**.

```
Request ──► authenticate (JWT check) ──► requireAdmin (user.role === 'admin') ──► Controller
                     │                                   │
                 (Invalid)                           (Non-admin)
                     ▼                                   ▼
                 HTTP 401                            HTTP 403
```

---

## 💎 Dynamic Pricing Plans (Milestone 4)

Flowmetrics features a flexible Pricing Plans domain with nested feature lists, highlighted flags, and draft/published lifecycle controls.

### Data Model (`PricingPlan`)

| Field | Type | Validation / Constraints |
| :--- | :--- | :--- |
| `name` | String | Required, trimmed, max 100 chars |
| `price` | Number | Required, minimum `0` |
| `billingCycle` | Enum | `'month' \| 'year'`, required |
| `description` | String | Optional, trimmed, max 500 chars |
| `features` | `string[]` | Required array of trimmed, non-empty strings (min 1, max 30) |
| `highlighted` | Boolean | Strict boolean (`true \| false`), default `false` |
| `status` | Enum | `'published' \| 'draft'`, default `'published'`, indexed |
| `createdAt` | Date | Managed timestamp |
| `updatedAt` | Date | Managed timestamp |

### Public vs. Admin Access Rules

```
PUBLIC CLIENTS                              ADMINISTRATORS
      │                                          │
      ├── GET /api/plans                         ├── POST /api/plans
      │   (Returns 'published' only)             ├── PUT /api/plans/:id
      │                                          ├── DELETE /api/plans/:id
      └── GET /api/plans/:id                     └── GET /api/plans/admin/all
          (Returns 'published' only,                 │
           HTTP 404 for draft/missing)               ▼
                                            [authenticate + requireAdmin]
                                            [planWriteRateLimiter]
                                            [validateBody(Zod)]
```

- **Route Disambiguation**: The admin route `GET /api/plans/admin/all` is explicitly registered **before** the parameterized `GET /api/plans/:id` route to prevent Express from treating `"admin/all"` as a resource ID.
- **Strict Public Filtering**: Public GET endpoints enforce `{ status: 'published' }` directly in the database query. Draft pricing plans will **never** leak through public endpoints.
- **Write Rate Limiting**: All write endpoints (`POST`, `PUT`, `DELETE`) are protected by `planWriteRateLimiter` (`express-rate-limit`) returning **HTTP 429** upon threshold breach.

---

## 📡 API Reference

### Public Endpoints
- `GET /api/health` - Operational health check reporting system & database connectivity.
- `POST /api/auth/login` - Rate-limited admin login endpoint.
- `GET /api/plans` - Returns all published pricing plans (sorted by price ascending).
- `GET /api/plans/:id` - Returns a single published pricing plan (returns 404 for draft plans).

### Protected Endpoints
- `GET /api/auth/me` - Requires `authenticate`. Returns the authenticated profile.
- `GET /api/auth/admin-test` - Requires `authenticate` and `requireAdmin`. Returns 200 for admins, 403 for non-admins.
- `GET /api/plans/admin/all` - Requires `authenticate` and `requireAdmin`. Returns all pricing plans including drafts.
- `POST /api/plans` - Requires `authenticate` and `requireAdmin`. Creates a new pricing plan (HTTP 201).
- `PUT /api/plans/:id` - Requires `authenticate` and `requireAdmin`. Updates an existing pricing plan (HTTP 200).
- `DELETE /api/plans/:id` - Requires `authenticate` and `requireAdmin`. Deletes a pricing plan (HTTP 200).

#### Example: Create Pricing Plan (`POST /api/plans`)
```json
{
  "name": "Scale Plan",
  "price": 79,
  "billingCycle": "month",
  "description": "For growing engineering organizations",
  "features": [
    "Up to 50 team members",
    "Real-time velocity tracking",
    "Workload imbalance alerts",
    "Custom exports & integrations",
    "Priority support"
  ],
  "highlighted": true,
  "status": "published"
}
```

#### Example: Response (`HTTP 201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "65e6b1234567890123456789",
    "name": "Scale Plan",
    "price": 79,
    "billingCycle": "month",
    "description": "For growing engineering organizations",
    "features": [
      "Up to 50 team members",
      "Real-time velocity tracking",
      "Workload imbalance alerts",
      "Custom exports & integrations",
      "Priority support"
    ],
    "highlighted": true,
    "status": "published",
    "createdAt": "2026-09-04T18:15:00.000Z",
    "updatedAt": "2026-09-04T18:15:00.000Z"
  },
  "meta": {
    "timestamp": "2026-09-04T18:15:00.000Z"
  }
}
```

---

## 🛠️ Workspace Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts frontend (`:3000`) and backend (`:5000`) concurrently |
| `npm run dev:frontend` | Starts the Next.js development server |
| `npm run dev:backend` | Starts the Express development server with `tsx watch` |
| `npm run build` | Builds both backend (TypeScript compile) and frontend (Next.js) |
| `npm run build:frontend` | Builds the Next.js production bundle |
| `npm run build:backend` | Compiles backend TypeScript to `./backend/dist` |
| `npm run typecheck` | Validates TypeScript types across both frontend and backend |
| `npm run seed:admin` | Seeds initial administrator account using environment credentials |
| `npm run test:auth` | Runs the automated authentication & authorization test suite |
| `npm run test:pricing` | Runs the 17-point Pricing Plans CRUD automated verification suite |
| `npm run lint` | Runs ESLint across all workspaces |

---

## 📋 Development Roadmap & Milestones

- [x] **Milestone 1**: Repository architecture, workspace setup, TypeScript config, health check endpoint, minimal Next.js foundation, shared conventions.
- [x] **Milestone 2**: Production MongoDB foundation (Mongoose connection pooling, strict Zod URI validation, lifecycle handling, enhanced health probe).
- [x] **Milestone 3**: Secure admin authentication & role-based authorization (bcryptjs, JWT, separate `authenticate` & `requireAdmin` middlewares, login rate limiting, admin seed script).
- [x] **Milestone 4**: Complete Pricing Plans CRUD (Mongoose modeling, nested feature array, highlighted boolean, draft/published status filtering, public read endpoints, admin write endpoints with rate limiting).
- [ ] **Milestone 5**: Blog Posts CRUD, draft/published protection, slug routes, TipTap rich text integration.
- [ ] **Milestone 6**: Full SaaS Landing page UI (Hero with analytics preview, Features hierarchy, Dynamic Pricing, Testimonials, Dynamic Blog, Footer/CTA).
- [ ] **Milestone 7**: Admin dashboard portal (Pricing management, Blog management with TipTap editor).
- [ ] **Milestone 8**: Production deployment setup (Vercel + Render), and final polish.
