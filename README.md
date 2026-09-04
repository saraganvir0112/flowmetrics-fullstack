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
│   │   └── types/              # TypeScript interfaces & API contracts
│   ├── public/                 # Static assets
│   ├── .env.example            # Frontend environment variables template
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS theme configuration
│   └── tsconfig.json           # Frontend TypeScript configuration
│
├── backend/                    # Express + Node.js API (Server)
│   ├── src/
│   │   ├── config/             # Environment & Mongoose database configuration
│   │   ├── controllers/        # Route handlers (auth, future pricing & blog)
│   │   ├── middleware/         # Error handler, auth, role & rate limiting
│   │   ├── models/             # Mongoose schemas (User, future Pricing & Blog)
│   │   ├── routes/             # Express API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── scripts/            # Seed and verification scripts
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

### 2. Password & Token Security
- **Bcrypt Hashing**: Passwords hashed using `bcryptjs` with salt cost factor 10.
- **Zero Leakage**: `passwordHash` has `select: false` on the User schema and is stripped by default.
- **Lean JWTs**: JWT payloads only contain `{ userId, email, role }`. Passwords and hashes are never embedded in tokens.
- **Timing & Enumeration Resistance**: `POST /api/auth/login` returns a generic `"Invalid email or password"` error regardless of whether the email exists.

### 3. Rate Limiting Protection
- `POST /api/auth/login` is protected by `authRateLimiter` (`express-rate-limit`).
- Configurable window (`AUTH_RATE_LIMIT_WINDOW_MS`) and max requests (`AUTH_RATE_LIMIT_MAX`).
- Exceeding the threshold returns **HTTP 429** (`TOO_MANY_REQUESTS`).

### 4. Admin Seeding Utility
Initialize the default administrator account for development or deployment:

```bash
npm run seed:admin
```
The script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables, safely hashes the password, and creates the admin record idempotently.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ supported)
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** cluster (or local MongoDB URI)

### 1. Installation
Install all dependencies across the workspace from the root:

```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` files to `.env` in both `frontend` and `backend`:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

#### Frontend Variables (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

#### Backend Variables (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API server listening port | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:3000` |
| `MONGODB_URI` | **Required** MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | **Required** Secret key for signing JWTs (min 16 chars) | `super_secret_jwt_key_at_least_16_chars` |
| `ADMIN_EMAIL` | Administrator account email | `admin@flowmetrics.dev` |
| `ADMIN_PASSWORD` | **Required** Administrator initial password (min 8 chars) | `AdminSecurePass123!` |
| `AUTH_RATE_LIMIT_MAX` | Max login attempts per window | `10` |
| `AUTH_RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15m) |

### 3. Run Development Servers
You can run both applications concurrently or independently from the root directory:

```bash
# Run both frontend and backend concurrently
npm run dev

# Run only the backend API (http://localhost:5000)
npm run dev:backend

# Run only the frontend app (http://localhost:3000)
npm run dev:frontend
```

---

## 📡 API Reference

### Public Endpoints
- `GET /api/health` - Operational health check reporting system & database connectivity.
- `POST /api/auth/login` - Rate-limited admin login endpoint.

**Login Request:**
```json
{
  "email": "admin@flowmetrics.dev",
  "password": "AdminSecurePass123!"
}
```

**Login Response (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65e6a123...",
      "name": "System Admin",
      "email": "admin@flowmetrics.dev",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": "2026-09-04T18:00:00.000Z"
  }
}
```

### Protected Endpoints
- `GET /api/auth/me` - Requires `authenticate` header (`Authorization: Bearer <token>`). Returns the authenticated profile.
- `GET /api/auth/admin-test` - Requires `authenticate` and `requireAdmin`. Returns 200 for admins, 403 for non-admins.

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
| `npm run lint` | Runs ESLint across all workspaces |

---

## 📋 Development Roadmap & Milestones

- [x] **Milestone 1**: Repository architecture, workspace setup, TypeScript config, health check endpoint, minimal Next.js foundation, shared conventions.
- [x] **Milestone 2**: Production MongoDB foundation (Mongoose connection pooling, strict Zod URI validation, lifecycle handling, enhanced health probe).
- [x] **Milestone 3**: Secure admin authentication & role-based authorization (bcryptjs, JWT, separate `authenticate` & `requireAdmin` middlewares, login rate limiting, admin seed script).
- [ ] **Milestone 4**: Dynamic Pricing Plans CRUD & nested feature list, public read-only vs admin endpoints with rate limiting.
- [ ] **Milestone 5**: Blog Posts CRUD, draft/published protection, slug routes, TipTap rich text integration.
- [ ] **Milestone 6**: Full SaaS Landing page UI (Hero with analytics preview, Features hierarchy, Dynamic Pricing, Testimonials, Dynamic Blog, Footer/CTA).
- [ ] **Milestone 7**: Admin dashboard portal (Pricing management, Blog management with TipTap editor).
- [ ] **Milestone 8**: Production deployment setup (Vercel + Render), and final polish.
