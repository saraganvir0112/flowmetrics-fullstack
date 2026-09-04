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
│   │   ├── config/             # Environment configuration and validation
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

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ supported)
- **npm**: v9.0.0 or higher

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
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | API server listening port | `5000` |
| `NODE_ENV` | Runtime environment | `development` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
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
- [ ] **Milestone 2**: Database connection (MongoDB Atlas/Mongoose), user/admin schemas, JWT authentication, and role authorization middleware.
- [ ] **Milestone 3**: Dynamic Pricing Plans model, validation, public read API, and admin CRUD endpoints with rate limiting.
- [ ] **Milestone 4**: Blog posts model (featured flag, draft/published status, slug routes), TipTap editor integration, public vs admin endpoints.
- [ ] **Milestone 5**: Full SaaS Landing page UI (Hero with analytics preview, Features hierarchy, Dynamic Pricing, Testimonials, Dynamic Blog, Footer/CTA).
- [ ] **Milestone 6**: Admin dashboard portal (Pricing management, Blog management with TipTap editor).
- [ ] **Milestone 7**: Production readiness, deployment setup (Vercel + Render), and final polish.
