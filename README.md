# Acowale CRM Machine

> A production-aware MVP for customer feedback collection and internal analytics, built on Next.js 15.

---

## Table of Contents

1. [Overview](#overview)
2. [My Journey](#my-journey)
3. [Tech Stack](#tech-stack)
4. [High-Level Design (HLD)](#high-level-design-hld)
5. [Low-Level Design (LLD)](#low-level-design-lld)
6. [Project Structure](#project-structure)
7. [Authentication Flow](#authentication-flow)
8. [Database Design](#database-design)
9. [API Design](#api-design)
10. [Validation Strategy](#validation-strategy)
11. [Error Handling](#error-handling)
12. [State Management](#state-management)
13. [Security](#security)
14. [Performance](#performance)
15. [Testing Strategy](#testing-strategy)
16. [Installation & Setup](#installation--setup)
17. [Environment Variables](#environment-variables)
18. [Trade-offs](#trade-offs)
19. [Future Improvements](#future-improvements)

---

## Overview

Acowale CRM Machine is a full-stack SaaS application that enables businesses to collect customer feedback through a public-facing form and provides administrators with a protected analytics dashboard to review, search, and analyse the submissions.

The application is designed with three core principles:

- **Readability**: Every architectural choice can be explained and justified without hand-waving.
- **Correctness**: Validation is enforced at three layers - client, server, and database.
- **Production-awareness**: Security, error handling, and scalability concerns are treated as first-class requirements, not afterthoughts.

---

## My Journey

The initial challenge was scoping: a machine test needs to be complete enough to demonstrate real engineering judgement but disciplined enough to avoid scope creep that makes code unreadable.

I started with the data model and API contracts before touching the UI, which ensured the frontend was always building on a stable foundation. The biggest design decision was the authentication strategy. Rather than introducing a third-party provider, I chose a self-managed JWT with HttpOnly cookies - it is simpler, interview-friendly, and correctly addresses the core security requirements (XSS protection via HttpOnly, CSRF mitigation via SameSite=Lax).

For the frontend, I used feature folders rather than type-based folders (`features/feedback` rather than `components/`, `hooks/`, `utils/` spread across the project) because it keeps the cognitive overhead low when navigating from a product concern to its implementation.

The final challenge was aesthetics. I applied the Acowale brand palette (primary `#0795FF`, text `#1E1E1E`, surface `#FAFBFC`) consistently across all components without reaching for a heavy UI library. The result is a design that feels like an internal Acowale product rather than a generic template.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack in one repo; API routes, pages, and middleware unified |
| Language | TypeScript | Type safety across the client–server boundary |
| Styling | Tailwind CSS | Utility-first; rapid iteration without custom CSS overhead |
| Forms | React Hook Form + Zod | Uncontrolled inputs for performance; schema-driven validation |
| Charts | Recharts | Lightweight; composable; sufficient for two chart types |
| Database | MongoDB (Mongoose) | Schema-flexible; well-suited for feedback documents |
| Auth | JWT + `jose` | Standards-based; Edge-compatible; no external dependency |
| Password hashing | `bcryptjs` | No native build requirements; suitable for local and cloud environments |
| Client state | Zustand | Minimal boilerplate; sufficient for auth user context |
| Notifications | Sonner | Accessible toast system |
| Testing | Jest + ts-jest | Industry-standard; TypeScript-first |

---

## High-Level Design (HLD)

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│  ┌────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Landing   │   │  Feedback    │   │   Dashboard    │  │
│  │   Page     │   │   Form       │   │   (Admin)      │  │
│  └─────┬──────┘   └──────┬───────┘   └───────┬────────┘  │
└────────┼─────────────────┼───────────────────┼───────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌──────────────────────────────────────────────────────────┐
│                  Next.js Edge Middleware                  │
│           (JWT verification on /dashboard/*)             │
└──────────────────────────┬───────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  /api/auth   │  │ /api/feedback│  │  /api/analytics  │
│  (login,     │  │  (POST, GET) │  │     (GET)        │
│  logout, me) │  └──────┬───────┘  └────────┬─────────┘
└──────┬───────┘         │                   │
       │                 ▼                   ▼
       │          ┌──────────────────────────────┐
       └─────────►│      MongoDB (Mongoose)       │
                  │   Users      Feedback         │
                  └──────────────────────────────┘
```

**Traffic Paths:**

1. **Public users** submit feedback via the form. The POST endpoint requires no authentication.
2. **Admin users** log in via `/login`. A JWT is set in an HttpOnly cookie.
3. The **Edge Middleware** intercepts all `/dashboard/*` requests, verifies the JWT, and redirects unauthenticated users to `/login`.
4. **Dashboard** fetches analytics and feedback data from protected API routes. The JWT cookie is automatically included in all same-origin requests.

---

## Low-Level Design (LLD)

### Request Lifecycle - Feedback Submission

```
Client (FeedbackForm)
  │  react-hook-form validates against feedbackSchema (Zod)
  │  POST /api/feedback  { name, email, category, rating, comment }
  ▼
API Route (app/api/feedback/route.ts)
  │  feedbackSchema.safeParse(body) → 422 on failure
  │  connectToDatabase()
  │  FeedbackModel.create(parsed.data)
  └─► MongoDB → feedback document created with timestamps
  �-�── apiSuccess({ feedback }, 201)
Client
  └── Toast notification: "Feedback submitted successfully."
```

### Request Lifecycle - Admin Login

```
Client (LoginForm)
  │  loginSchema.safeParse() validates on submit
  │  POST /api/auth/login  { email, password }
  ▼
API Route (app/api/auth/login/route.ts)
  │  loginSchema.safeParse(body) → 422 on failure
  │  connectToDatabase() + ensureSeededAdmin()
  │  UserModel.findOne({ email })   → 401 if not found
  │  bcrypt.compare(password, hash) → 401 if mismatch
  │  signAuthToken({ id, email, role })
  │  cookies().set(AUTH_COOKIE_NAME, token, { httpOnly, sameSite, secure })
  └── apiSuccess({ user })
Client
  └── useAuthStore.setUser(user) → redirect /dashboard
```

### Request Lifecycle - Analytics Dashboard

```
Client (DashboardPageClient)
  │  useEffect → getAnalytics()
  │  GET /api/analytics  (cookie sent automatically)
  ▼
Edge Middleware
  │  verifyAuthToken(cookie) → redirect /login if invalid
  ▼
API Route (app/api/analytics/route.ts)
  │  requireAdmin() → 401 if missing/invalid JWT
  │  connectToDatabase()
  │  Promise.all([
  │    countDocuments(),
  │    aggregate(averageRating),
  │    aggregate(categoryCounts),
  │    aggregate(dailyTrend),
  │    countDocuments(recentFeedback last 7d)
  │  ])
  └── apiSuccess({ totalFeedback, averageRating, categoryCounts, dailyTrend, recentFeedback })
Client
  └── Renders PieChart (Recharts) + BarChart (Recharts)
```

---

## Project Structure

```
acowale-crm-machine/
├── app/                          # Next.js App Router entry points
│   ├── (public)/
│   │   └── page.tsx              # Landing page
│   ├── api/
│   │   ├── analytics/route.ts    # GET /api/analytics
│   │   ├── auth/
│   │   │   ├── login/route.ts    # POST /api/auth/login
│   │   │   ├── logout/route.ts   # POST /api/auth/logout
│   │   │   └── me/route.ts       # GET /api/auth/me
│   │   ├── feedback/route.ts     # GET + POST /api/feedback
│   │   └── health/route.ts       # GET /api/health
│   ├── dashboard/page.tsx        # Protected admin dashboard
│   ├── feedback/page.tsx         # Public feedback form page
│   ├── login/page.tsx            # Admin login page
│   ├── globals.css               # Design tokens (CSS variables)
│   └── layout.tsx                # Root layout (Inter font, Sonner)
│
├── components/
│   ├── charts/
│   │   ├── category-pie-chart.tsx
│   │   └── daily-trend-chart.tsx
│   ├── common/
│   │   ├── empty-state.tsx
│   │   ├── pagination.tsx
│   │   ├── section-heading.tsx
│   │   └── stat-card.tsx
│   └── ui/                       # Primitive UI components (shadcn/ui-inspired)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── textarea.tsx
│
├── features/                     # Feature-colocated logic
│   ├── analytics/
│   │   └── api.ts                # Client-side analytics fetch
│   ├── auth/
│   │   ├── api.ts                # Client-side auth fetch helpers
│   │   ├── constants.ts          # AUTH_COOKIE_NAME
│   │   ├── login-form.tsx        # Login form component
│   │   └── schema.ts             # loginSchema (Zod)
│   ├── dashboard/
│   │   └── dashboard-page-client.tsx
│   └── feedback/
│       ├── api.ts                # Client-side feedback fetch helpers
│       ├── categories.ts         # FEEDBACK_CATEGORIES constant
│       ├── feedback-form.tsx     # Public feedback form component
│       └── schema.ts             # feedbackSchema (Zod)
│
├── lib/                          # Infrastructure + cross-cutting concerns
│   ├── api-response.ts           # apiSuccess / apiError helpers
│   ├── db.ts                     # MongoDB connection + admin seeding
│   ├── env.ts                    # Environment variable validation
│   ├── jwt.ts                    # signAuthToken / verifyAuthToken
│   ├── utils.ts                  # cn, formatDate, formatCategoryLabel
│   └── validation.ts             # getZodErrorMessages
│
├── models/
│   ├── Feedback.ts               # Mongoose Feedback document model
│   └── User.ts                   # Mongoose User document model
│
├── store/
│   └── auth.ts                   # Zustand auth user store
│
├── types/
│   ├── analytics.ts              # AnalyticsSummary, CategoryCount
│   ├── api.ts                    # ApiResponse<T>
│   ├── auth.ts                   # AuthUser, UserRole
│   └── feedback.ts               # FeedbackRecord, FeedbackListResponse
│
├── __tests__/                    # Jest unit tests
│   ├── utils.test.ts
│   ├── validation.test.ts
│   ├── api-response.test.ts
│   ├── jwt.test.ts
│   └── analytics.test.ts
│
├── middleware.ts                 # Edge middleware: JWT guard on /dashboard/*
├── .github/workflows/ci.yml     # GitHub Actions CI pipeline
├── DECISIONS.md                 # Engineering decisions log
├── TEACH_US.md                  # Bonus engineering topic
├── jest.config.js
├── tailwind.config.ts
└── next.config.ts
```

---

## Authentication Flow

The application uses a stateless JWT authentication pattern with HttpOnly cookies.

```
1. Admin submits credentials via POST /api/auth/login
2. Server verifies email and bcrypt-hashed password against MongoDB
3. Server signs a JWT (HS256, 7-day expiry) using JWT_SECRET
4. JWT is stored in an HttpOnly, SameSite=Lax cookie
   → Not accessible to JavaScript (XSS-safe)
   → Not sent on cross-origin requests (CSRF-mitigated)
5. All subsequent requests to /dashboard/* pass through Edge Middleware
6. Middleware calls verifyAuthToken(cookie) using jose
   → Valid: request proceeds
   → Invalid or missing: redirect to /login
7. Protected API routes perform a secondary requireAdmin() check
   → Defense-in-depth: middleware alone is not trusted
8. Logout clears the cookie via POST /api/auth/logout
```

**Why `jose` instead of `jsonwebtoken`?**
`jose` is a Web Standards–based JWT library compatible with the Next.js Edge Runtime. `jsonwebtoken` uses Node.js-specific APIs (`crypto`, `Buffer`) that are unavailable in the Edge Runtime where middleware runs.

---

## Database Design

### Collection: `feedbacks`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `_id` | ObjectId | Primary key | Auto-generated |
| `name` | String | required, trim | Submitter's display name |
| `email` | String | required, trim, lowercase | Used for deduplication and contact |
| `category` | String | required, enum | One of: `product`, `support`, `sales`, `other` |
| `rating` | Number | required, min: 1, max: 5 | Integer star rating |
| `comment` | String | required, trim, maxlength: 500 | Free-text feedback body |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### Collection: `users`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `_id` | ObjectId | Primary key | Auto-generated |
| `email` | String | required, unique, lowercase | Admin email address |
| `password` | String | required | bcrypt hash (rounds: 10) |
| `role` | String | required, enum | Currently: `admin` only |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

**Admin Seeding**: On first startup, `ensureSeededAdmin()` checks for an existing admin user and creates one from environment variables if none exists. This avoids a separate seed script requirement.

---

## API Design

All responses follow a consistent envelope format:

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": ["..."] }
```

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate admin; set JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT cookie |
| `GET` | `/api/auth/me` | Cookie | Return current authenticated user |
| `POST` | `/api/feedback` | Public | Submit a feedback record |
| `GET` | `/api/feedback` | Cookie | Paginated feedback list with search and category filter |
| `GET` | `/api/analytics` | Cookie | Dashboard summary (totals, ratings, trends) |
| `GET` | `/api/health` | Public | Application health check |

### Query Parameters - `GET /api/feedback`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | `""` | Regex search across `name`, `email`, `comment` |
| `category` | string | `"all"` | Filter by feedback category |
| `page` | number | `1` | Page number (1-indexed) |
| `pageSize` | number | `10` | Records per page |

---

## Validation Strategy

Validation is applied at three independent layers to prevent invalid data from reaching the database regardless of which layer is bypassed:

| Layer | Tool | Location | Behaviour |
|---|---|---|---|
| Client | React Hook Form + Zod | `features/*/schema.ts` | Prevents form submission; displays inline errors |
| Server | Zod `.safeParse()` | API route handlers | Returns HTTP 422 with structured error messages |
| Database | Mongoose schema | `models/` | Last-resort constraint enforcement; throws on violation |

**Zod is the single source of truth** for field rules. The same schema is imported by the form and the API route, ensuring client and server constraints never drift.

---

## Error Handling

All API routes are wrapped in a `try/catch` block. Errors are surfaced through the `apiError()` helper, which normalises the response format and status code.

```typescript
// Consistent error shape - always a known structure
apiError("Unable to submit feedback.", [error.message], 500);
```

On the client, error states are handled per-feature:
- **Form errors**: React Hook Form field-level display
- **Network errors**: Sonner toast notification
- **Auth errors**: Redirect to `/login`

---

## State Management

Client-side state is intentionally minimal:

| Store | Tool | Responsibility |
|---|---|---|
| `useAuthStore` | Zustand | Stores the authenticated user object after login; used to render the admin name in the dashboard header |

Server-authoritative state (feedback list, analytics data) is fetched directly in component effects and is never stored in Zustand. This avoids cache invalidation complexity and keeps the data model simple.

---

## Security

| Concern | Mitigation |
|---|---|
| XSS | JWT stored in HttpOnly cookie, inaccessible to JavaScript |
| CSRF | `SameSite=Lax` cookie attribute prevents cross-site POST requests |
| Password Storage | bcrypt with 10 salt rounds |
| JWT Integrity | HS256 signature validated on every protected request |
| Route Protection | Edge Middleware (line of defence 1) + `requireAdmin()` in API routes (line of defence 2) |
| Sensitive env vars | `JWT_SECRET` and `MONGODB_URI` are never exposed to the browser bundle |

---

## Performance

| Concern | Approach |
|---|---|
| Database connections | Connection pooling via a module-level singleton in `lib/db.ts`; avoids reconnecting on every request |
| Analytics aggregation | All five analytics queries run in `Promise.all()` in a single request, minimising round-trips |
| Static rendering | The landing page is statically rendered at build time (no DB queries) |
| Client-side re-renders | React Hook Form uses uncontrolled inputs; the form does not re-render on every keystroke |
| Bundle size | No heavy client-side dependencies; Recharts and React Hook Form are the largest client bundle additions |

---

## Testing Strategy

The test suite is located in `__tests__/` and uses Jest with `ts-jest`.

**Philosophy**: Tests target pure logic and predictable interfaces. Anything that requires a live database or HTTP server is excluded from unit tests and belongs in an integration test suite.

### Test Coverage Areas

| File | What Is Tested |
|---|---|
| `utils.test.ts` | `formatCategoryLabel`, `formatDate` edge cases |
| `validation.test.ts` | `feedbackSchema`, `loginSchema` - valid and invalid payloads |
| `api-response.test.ts` | `apiSuccess`, `apiError` - shape, status codes, defaults |
| `jwt.test.ts` | `signAuthToken`, `verifyAuthToken` - round-trip, expiry handling |
| `analytics.test.ts` | Analytics calculation helpers - rounding, empty states |

**Running tests:**

```bash
npm run test
```

**Running tests in watch mode:**

```bash
npm run test -- --watch
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier is sufficient)

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd acowale-crm-machine

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 4. Start the development server
npm run dev

# 5. Open the application
open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | Full MongoDB connection string (e.g. MongoDB Atlas URI) |
| `JWT_SECRET` | Yes | A random string of at least 32 characters used to sign JWTs |
| `ADMIN_EMAIL` | Optional | Seed admin email (defaults to `admin@acowale.local`) |
| `ADMIN_PASSWORD` | Optional | Seed admin password (defaults to `Admin@123`) |

---

## Trade-offs

See [DECISIONS.md](./DECISIONS.md) for a detailed record of every engineering decision and its reasoning.

---

## Future Improvements

| Area | Improvement |
|---|---|
| Auth | Expand to multi-user roles (viewer, editor, admin) with RBAC |
| Analytics | Pre-compute aggregations into a summary collection on a schedule to avoid per-request aggregation at scale |
| Search | Replace regex search with MongoDB Atlas Search (full-text, typo-tolerant) |
| Rate Limiting | Add per-IP rate limiting on the public feedback POST endpoint |
| Exports | CSV or PDF export of filtered feedback records |
| Observability | Structured logging (Pino), error tracking (Sentry), and performance monitoring |
| Testing | Add integration tests for all API routes using a test MongoDB database |
| CI/CD | Add deployment step to the GitHub Actions workflow (e.g. Vercel) |
| Audit Log | Record admin actions (login, logout, view) for compliance |
