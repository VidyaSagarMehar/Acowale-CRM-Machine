# Engineering Decisions

This document records every significant architectural and implementation decision made during the development of Acowale CRM Machine. Each entry follows a consistent structure to make the reasoning traceable and reviewable.

---

## 1. Framework and Stack Selection

**Overview**
The application requires server-side rendering, API routes, middleware, and a modern frontend - all within a single deployable unit.

**Decision**
Next.js 15 (App Router) with TypeScript.

**Reasoning**
The App Router model co-locates pages, server components, API routes, and Edge Middleware in one framework without requiring a separate Express or Fastify server. TypeScript enforces type safety across the client–server boundary, catching mismatches between API response shapes and the frontend consumers that use them.

**Trade-offs**
- Next.js introduces framework-level abstractions (RSC, Server Actions, Edge Runtime constraints) that have a learning curve.
- A simpler React SPA with a separate Express API would be easier to deploy independently, but the monorepo structure is more appropriate for a small, rapid MVP.

---

## 2. Database Selection

**Overview**
The application needs to persist feedback records and admin users with a schema that may evolve as the product matures.

**Decision**
MongoDB with Mongoose.

**Reasoning**
Feedback is a document-oriented domain. The shape of a feedback submission (name, email, category, rating, comment) maps naturally to a MongoDB document. Mongoose adds schema validation, model definitions, and a clear TypeScript interface layer on top of the driver. The flexible document model also makes it easier to extend the schema (e.g. add metadata fields) without a migration.

**Trade-offs**
- MongoDB does not enforce referential integrity natively. For a feedback record that must always belong to a valid category, application-level validation (Zod) and Mongoose `enum` constraints are relied upon instead.
- PostgreSQL with Prisma would be a stronger choice for relational data with complex joins. For this domain, the additional complexity is not justified.

---

## 3. Authentication Strategy

**Overview**
The dashboard is a protected internal tool. Only a single administrator account needs to be supported for the MVP.

**Decision**
Stateless JWT authentication with HttpOnly, SameSite=Lax cookies and a single seeded admin.

**Reasoning**
JWTs are stateless, which means no session store is required. Storing the token in an HttpOnly cookie (rather than `localStorage`) prevents JavaScript-based XSS attacks from reading the token. Setting `SameSite=Lax` mitigates the most common CSRF attack vectors. The `jose` library is used instead of `jsonwebtoken` because it is compatible with the Next.js Edge Runtime where middleware executes.

**Trade-offs**
- A stateless JWT cannot be revoked before its expiry window. In production, a token blacklist (Redis) or a short expiry with refresh tokens would be required.
- The single seeded admin is an interview-appropriate simplification. A real product would require user management, role-based access control, and an invitation flow.

---

## 4. Layered Validation

**Overview**
Invalid data can enter the system from multiple entry points: the browser form, a raw API call, or a programmatic client.

**Decision**
Three-layer validation: React Hook Form (client) → Zod `.safeParse()` (server) → Mongoose schema constraints (database).

**Reasoning**
No single layer is fully trusted. A client-only validation is trivially bypassed. A server-only validation degrades the UX. A database-only constraint results in unstructured error messages. Using Zod as the single source of truth (the same schema is imported by both the form and the API route) ensures that the client and server constraints never drift out of sync.

**Trade-offs**
- Maintaining three layers means some constraints (e.g. `maxlength: 500`) are written in two places - the Zod schema and the Mongoose model. This is an intentional redundancy for defence-in-depth.

---

## 5. Feature-Folder Architecture

**Overview**
The project needs an organisational pattern that scales with additional features without creating deep import graphs or over-abstracted shared utilities.

**Decision**
Feature folders under `features/` co-locate the schema, API client, and UI components for each product concern.

**Reasoning**
A type-based folder structure (`components/`, `hooks/`, `utils/`) requires a developer to open three separate folders to understand a single feature. A feature-based structure (`features/feedback/`) keeps the schema, form, and API client in one place. Navigation from a product requirement to the implementing code is direct.

**Trade-offs**
- Some primitives (the UI component library in `components/ui/`, infrastructure in `lib/`) remain shared across features. The boundary between "feature-specific" and "shared" requires ongoing discipline to maintain.

---

## 6. Client State Management

**Overview**
The application has minimal client-side state beyond the authenticated user identity.

**Decision**
Zustand for the auth user store only. No global state for server data.

**Reasoning**
Zustand provides a minimal, hook-based API with no boilerplate. The auth user object is the only piece of state that needs to be shared across the component tree (dashboard header, logout action). All server-authoritative data (feedback list, analytics) is fetched directly in the components that consume it and is not cached globally, avoiding cache invalidation complexity.

**Trade-offs**
- The dashboard refetches analytics on every mount. For the current scale this is acceptable. At higher traffic, React Query or SWR would add caching, deduplication, and background refresh with minimal additional complexity.

---

## 7. Password Hashing Library

**Overview**
Admin passwords must be stored securely and verified at login without requiring native binary compilation.

**Decision**
`bcryptjs` (pure JavaScript) over `bcrypt` (native bindings).

**Reasoning**
`bcrypt` requires Python and a C++ build toolchain at install time, which creates friction in local development environments, particularly on Windows. `bcryptjs` is a drop-in API-compatible alternative implemented entirely in JavaScript, removing the native dependency while maintaining the same security guarantees.

**Trade-offs**
- `bcryptjs` is measurably slower than `bcrypt`. At the scale of a CRM admin login (infrequent, non-concurrent), this performance difference is irrelevant.

---

## 8. API Response Shape

**Overview**
All API routes need to return responses in a consistent, predictable shape.

**Decision**
A shared `apiSuccess` / `apiError` helper in `lib/api-response.ts` enforces a standard envelope: `{ success, message, data }` or `{ success, message, errors }`.

**Reasoning**
Consistent response envelopes allow the frontend to handle API responses with a single pattern rather than writing bespoke error handling for each endpoint. The shape is also easy to document and test.

**Trade-offs**
- The envelope adds a small amount of JSON overhead per response. For an API at this scale, this is negligible.

---

## 9. CI Pipeline

**Overview**
The repository needs automated quality checks to prevent regressions on every push.

**Decision**
GitHub Actions workflow (`.github/workflows/ci.yml`) that runs `npm ci`, `npm run lint`, `npm run test`, and `npm run build` on every push to `main` and on every pull request.

**Reasoning**
A CI pipeline makes quality gates visible and automatic. It prevents broken or untested code from being merged silently. The pipeline is intentionally simple - no Docker, no deployment step - to keep feedback fast.

**Trade-offs**
- The build step in CI requires `MONGODB_URI` and `JWT_SECRET` environment variables. Dummy values are provided in the workflow file. This is acceptable for build-time validation but not for integration tests that require a real database.

---

## 10. What Breaks at 100,000 Users?

**Overview**
A machine test architecture is optimised for clarity and simplicity. At production scale, several bottlenecks emerge.

**Decision**
Documented as known limitations, not deferred bugs.

| Component | Failure Mode | Resolution Path |
|---|---|---|
| Regex feedback search | Full collection scan with no index | MongoDB Atlas Search or indexed text fields |
| Per-request analytics aggregation | Increasing latency as collection grows | Precomputed summary documents refreshed on a schedule |
| Single admin account | No multi-tenancy or delegation | RBAC with a `roles` collection |
| No rate limiting | Public POST `/api/feedback` is open to spam | Per-IP rate limiting at the Edge (Middleware) |
| No observability | Silent failures and no performance baseline | Structured logging (Pino), error tracking (Sentry) |

---

## 11. What I Would Improve, Change, or Challenge

**Overview**
One aspect of the current design that would benefit from architectural reconsideration.

**Decision**
The public feedback form as a standalone page.

**Reasoning**
For a CRM product, feedback is usually contextual - it is collected in-product, immediately after an interaction. A standalone form page creates unnecessary friction and reduces submission rates. An embedded feedback widget (rendered in a slide-out drawer or a modal overlay) would match where users are when they have feedback to share, rather than requiring them to navigate away to a separate URL.

This would also allow the feedback form to capture additional context automatically (current page URL, user session ID) without asking the user to supply it manually.
