# Flowmetrics 📊

> Modern Team Productivity & Analytics SaaS Platform for Remote and Hybrid Teams.

Flowmetrics provides engineering and product teams with deep insights into workload balance, project velocity, time distribution, and data-driven workflow optimizations.

---

## 🌐 Live Deployments & Production URLs

- **Production Web Application (Vercel)**: [https://flowmetrics-fullstack-frontend.vercel.app](https://flowmetrics-fullstack-frontend.vercel.app)
- **Production Backend API (Render)**: [https://flowmetrics-fullstack.onrender.com/api](https://flowmetrics-fullstack.onrender.com/api)
- **API Health Check**: [https://flowmetrics-fullstack.onrender.com/api/health](https://flowmetrics-fullstack.onrender.com/api/health)
- **Frontend Health Probe**: [https://flowmetrics-fullstack-frontend.vercel.app/api/health](https://flowmetrics-fullstack-frontend.vercel.app/api/health)
- **Admin Workspace Portal**: [https://flowmetrics-fullstack-frontend.vercel.app/admin](https://flowmetrics-fullstack-frontend.vercel.app/admin)
  - **Blog Management**: `/admin/blog`
  - **Pricing Management**: `/admin/pricing`
  - **Credentials**: Available in environment configuration (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

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

---

## 📝 Dynamic Blog Domain & TipTap Editor (Milestone 5)

Flowmetrics includes a complete editorial blog CMS with draft/published lifecycles, prioritized featured posts, URL slug resolution, rich-text editing via TipTap, and dual-layer defense-in-depth HTML sanitization.

### Data Model (`BlogPost`)

| Field | Type | Validation / Constraints |
| :--- | :--- | :--- |
| `title` | String | Required, trimmed, max 180 chars |
| `slug` | String | Required, unique index, lowercase alphanumeric with hyphens (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`), max 200 chars |
| `excerpt` | String | Required, trimmed, max 300 chars |
| `content` | String | Required, sanitized rich HTML, max 50,000 chars |
| `featured` | Boolean | Strict boolean (`true \| false`), default `false`, indexed |
| `status` | Enum | `'published' \| 'draft'`, default `'draft'`, indexed |
| `tags` | `string[]` | Array of trimmed strings (max 10 tags, 30 chars each) |
| `coverImage` | String | Optional URL string |
| `authorName` | String | Required, default `'Flowmetrics Team'`, max 80 chars |
| `authorAvatar` | String | Optional URL string |
| `publishedAt` | Date | Assigned automatically on first publish; indexed |
| `createdAt` | Date | Managed timestamp |
| `updatedAt` | Date | Managed timestamp |

### Compound Indexing & Query Prioritization
- **Public Feed Query**:
  ```ts
  BlogPost.find({ status: 'published' }).sort({ featured: -1, publishedAt: -1, createdAt: -1 })
  ```
  Featured published posts are always prioritized at the top of the public feed, followed by the newest published articles.
- **Strict Isolation**: Drafts are completely hidden from public queries (`{ status: 'published' }`). A draft slug requested on `GET /api/blog/:slug` returns **HTTP 404 Not Found**.

### Defense-in-Depth HTML Sanitization
Flowmetrics employs double-layer sanitization powered by `sanitize-html` to protect against Cross-Site Scripting (XSS):
1. **Backend Pre-Persistence Sanitization**: Before persisting to MongoDB on `POST /api/blog` or `PUT /api/blog/:id`, all HTML content is parsed through `sanitizeBlogContent()`. All `<script>` tags, inline event handlers (`onclick`, `onerror`, `onload`), `javascript:` URI schemes, and dangerous tags (`iframe`, `object`, `embed`) are stripped.
2. **Frontend Pre-Render Sanitization**: Before dangerously setting inner HTML in the public blog detail page (`/blog/[slug]`), the content is sanitized a second time on the client.

### Route Disambiguation
Admin blog endpoints are declared **before** the parameterized slug endpoint to eliminate wildcard collisions:
```ts
router.get('/admin/all', authenticate, requireAdmin, blogController.getAllPostsAdmin);
router.get('/admin/:id', authenticate, requireAdmin, blogController.getPostByIdAdmin);
router.get('/:slug', blogController.getPostBySlug);
```

---

## 📡 API Reference

### Public Endpoints
- `GET /api/health` - Operational health check reporting system & database connectivity.
- `POST /api/auth/login` - Rate-limited admin login endpoint.
- `GET /api/plans` - Returns all published pricing plans (sorted by price ascending).
- `GET /api/plans/:id` - Returns a single published pricing plan (returns 404 for draft plans).
- `GET /api/blog` - Returns all published blog posts (prioritizing `featured: true` first, then newest `publishedAt`).
- `GET /api/blog/:slug` - Returns a single published blog post by slug (returns 404 for draft posts or non-existent slugs).

### Protected Endpoints
- `GET /api/auth/me` - Requires `authenticate`. Returns the authenticated profile.
- `GET /api/auth/admin-test` - Requires `authenticate` and `requireAdmin`. Returns 200 for admins, 403 for non-admins.
- `GET /api/plans/admin/all` - Requires `authenticate` and `requireAdmin`. Returns all pricing plans including drafts.
- `POST /api/plans` - Requires `authenticate` and `requireAdmin`. Creates a new pricing plan (HTTP 201).
- `PUT /api/plans/:id` - Requires `authenticate` and `requireAdmin`. Updates an existing pricing plan (HTTP 200).
- `DELETE /api/plans/:id` - Requires `authenticate` and `requireAdmin`. Deletes a pricing plan (HTTP 200).
- `GET /api/blog/admin/all` - Requires `authenticate` and `requireAdmin`. Returns all blog posts including drafts.
- `GET /api/blog/admin/:id` - Requires `authenticate` and `requireAdmin`. Returns any blog post by its MongoDB ObjectId.
- `POST /api/blog` - Requires `authenticate` and `requireAdmin`. Creates a new blog post with sanitized HTML (HTTP 201).
- `PUT /api/blog/:id` - Requires `authenticate` and `requireAdmin`. Updates an existing blog post (HTTP 200).
- `DELETE /api/blog/:id` - Requires `authenticate` and `requireAdmin`. Deletes a blog post (HTTP 200).

#### Example: Create Blog Post (`POST /api/blog`)
```json
{
  "title": "Scaling Distributed Teams in 2026",
  "slug": "scaling-distributed-teams-2026",
  "excerpt": "Key practices and productivity metrics for high-performing remote engineering teams.",
  "content": "<h2>Introduction</h2><p>Managing remote velocity requires actionable telemetry...</p>",
  "featured": true,
  "status": "published",
  "tags": ["remote-work", "engineering", "productivity"],
  "authorName": "Flowmetrics Team"
}
```

---

## 🚀 Marketing Website & Visual Experience (Milestone 6)

Flowmetrics features a polished, responsive B2B SaaS marketing website built with Next.js App Router, Tailwind CSS, Motion, and Recharts.

### 1. Visual Style & Design System
- **Dark-First Palette**: Deep navy background (`#070B14`), card surface (`#0D1422`), elevated surface (`#111A2E`), crisp border (`#1A2438`), and blue (`#3B82F6`) / teal (`#14B8A6`) accents.
- **Restrained Motion**: Subtle section entrances, hover micro-interactions, and tab transitions without distracting effects.
- **Analytics Visual Language**: High-signal dashboard panels, crisp typography, and status indicators.

### 2. Homepage Sections (10 Core Modules)
1. **Navbar**: Responsive sticky navigation with logo mark, section anchors (`#features`, `#analytics`, `#pricing`, `#blog`), "Sign in" admin route, and mobile drawer.
2. **Hero**: Headline *"Know where your team's work really goes."*, supporting copy on distributed team visibility, dual CTAs, and an interactive React component hero dashboard.
3. **Trust Strip**: Restrained fictional customer logos (Northstar, Vertex, Arcflow, Luma, Stackline) with clean geometric marks.
4. **Features Spotlight & Modules**:
   - Large Spotlight: *"Turn work data into decisions."* with capacity and health breakdown.
   - 6 Feature Modules: Automated Time Tracking, Workload Intelligence, Project Velocity Insights, Executive Team Reporting, Milestone & Goal Alignment, Contextual Smart Alerts.
5. **Analytics Product Showcase**: *"A clearer picture of work."* with interactive tabs (Sprint Velocity Trends vs Workload Time Breakdown) powered by Recharts.
6. **Dynamic Pricing Plans**: Connects to `GET /api/plans` with dynamic `highlighted === true` detection, loading skeletons, error states, and empty states.
7. **Testimonials**: 3 fictional engineering leader quotes with abstract geometric avatars and concrete telemetry metrics.
8. **Dynamic Blog Feed**: Connects to `GET /api/blog`, displaying 3–6 articles with prioritized featured posts, metadata, and routing to `/blog/[slug]`.
9. **Final CTA**: *"Give your team a clearer way to work."* with "Start free" and "Talk to sales" actions.
10. **Footer**: Brand links, solutions, resources, company information, system status pill, and copyright.

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
| `npm run seed:content` | Optional manual script to populate sample published Pricing Plans & Blog Posts |
| `npm run test:auth` | Runs the automated authentication & authorization test suite |
| `npm run test:pricing` | Runs the 17-point Pricing Plans CRUD automated verification suite |
| `npm run test:blog` | Runs the 24-point Blog Domain & Publishing automated verification suite |
| `npm run lint` | Runs ESLint across all workspaces |

---

## 📋 Development Roadmap & Milestones

- [x] **Milestone 1**: Repository architecture, workspace setup, TypeScript config, health check endpoint, minimal Next.js foundation, shared conventions.
- [x] **Milestone 2**: Production MongoDB foundation (Mongoose connection pooling, strict Zod URI validation, lifecycle handling, enhanced health probe).
- [x] **Milestone 3**: Secure admin authentication & role-based authorization (bcryptjs, JWT, separate `authenticate` & `requireAdmin` middlewares, login rate limiting, admin seed script).
- [x] **Milestone 4**: Complete Pricing Plans CRUD (Mongoose modeling, nested feature array, highlighted boolean, draft/published status filtering, public read endpoints, admin write endpoints with rate limiting).
- [x] **Milestone 5**: Blog Posts CRUD, draft/published protection, slug routes, TipTap rich text integration, double sanitization.
- [x] **Milestone 7**: Admin dashboard portal (Pricing management with full CRUD, dynamic features checklist & status/highlight toggles, Blog management with TipTap rich text editor, draft/publish lifecycle).
- [x] **Milestone 8**: Production deployment setup (Vercel + Render + MongoDB Atlas), automated verification suites, mobile responsiveness, and final compliance polish.


