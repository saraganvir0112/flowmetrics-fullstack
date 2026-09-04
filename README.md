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
│   │   ├── controllers/        # Route handlers (future milestones)
│   │   ├── middleware/         # Error handler, auth & rate limiting
│   │   ├── models/             # Mongoose schemas (future milestones)
│   │   ├── routes/             # Express API routes
│   │   ├── types/              # Backend TypeScript interfaces & contracts
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
- **Validation**: Zod
- **Security & Rate Limiting**: Express-rate-limit, CORS, bcrypt, JWT

### Deployment Targets
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🗄️ Database Foundation & Architecture (Milestone 2)

Flowmetrics utilizes **MongoDB Atlas** with **Mongoose** as the Object-Document Mapper (ODM). The database connection layer provides:

1. **Connection Pooling & Reuse**: Checks `mongoose.connection.readyState` before attempting connections, avoiding duplicate socket creation.
2. **Server Timeout Controls**: Configured with `serverSelectionTimeoutMS: 5000` to quickly fail on unreachable networks rather than hanging indefinitely.
3. **Strict Validation**: Requires `MONGODB_URI` via Zod at startup.
4. **Sanitized Telemetry**: Health checks and logs surface connection host and database names without ever printing credentials or connection strings.
5. **Graceful Lifecycle Management**: Listens for `SIGINT` and `SIGTERM`, stopping HTTP traffic before disconnecting Mongoose.

### Backend Startup Pipeline

```
┌────────────────────────────────┐
│ 1. Environment Validation (Zod)│
└───────────────┬────────────────┘
                ▼
┌────────────────────────────────┐
│ 2. Mongoose Database Connect   │ ──(Failure)──► Log Error & Exit Process (Code 1)
└───────────────┬────────────────┘
                ▼ (Success)
┌────────────────────────────────┐
│ 3. Create Express App Factory  │
└───────────────┬────────────────┘
                ▼
┌────────────────────────────────┐
│ 4. Start HTTP Server (Port 5000│
└────────────────────────────────┘
```

> **Note**: The HTTP server will intentionally fail to start if the database connection cannot be established, preventing inconsistent or zombie server processes.

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
| `MONGODB_URI` | **Required** MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/flowmetrics?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `development_jwt_secret` |

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

## 🔍 System Health Check Verification

The backend exposes an operational health probe at `GET /api/health` with real-time database connectivity:

```bash
curl http://localhost:5000/api/health
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "flowmetrics-api",
    "version": "0.1.0",
    "environment": "development",
    "uptime": 42,
    "database": "connected",
    "timestamp": "2026-09-04T17:30:00.000Z"
  },
  "meta": {
    "timestamp": "2026-09-04T17:30:00.000Z"
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
| `npm run lint` | Runs ESLint across all workspaces |

---

## 📋 Development Roadmap & Milestones

- [x] **Milestone 1**: Repository architecture, workspace setup, TypeScript config, health check endpoint, minimal Next.js foundation, shared conventions.
- [x] **Milestone 2**: Production MongoDB foundation (Mongoose connection pooling, strict Zod URI validation, lifecycle handling, enhanced health probe).
- [ ] **Milestone 3**: Database models (User/Admin, PricingPlan, BlogPost), JWT authentication, and role authorization middleware.
- [ ] **Milestone 4**: Dynamic Pricing Plans CRUD & nested feature list, public read-only vs admin endpoints.
- [ ] **Milestone 5**: Blog Posts CRUD, draft/published protection, slug routes, TipTap rich text integration.
- [ ] **Milestone 6**: Full SaaS Landing page UI (Hero with analytics preview, Features hierarchy, Dynamic Pricing, Testimonials, Dynamic Blog, Footer/CTA).
- [ ] **Milestone 7**: Admin dashboard portal (Pricing management, Blog management with TipTap editor).
- [ ] **Milestone 8**: Production deployment setup (Vercel + Render), and final polish.
