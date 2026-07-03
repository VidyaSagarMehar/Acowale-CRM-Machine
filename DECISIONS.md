# Engineering Decisions

## 1. Why this stack?

This stack keeps the codebase small while still covering real product concerns. Next.js App Router gives pages, API routes, and middleware in one place. TypeScript, Zod, and React Hook Form keep validation explicit. Zustand handles lightweight client state without adding ceremony. Recharts is enough for the two requested visualizations.

## 2. Why MongoDB?

MongoDB fits the feedback domain well because the initial schema is simple, document-oriented, and likely to evolve. Mongoose adds a clear model layer and validation-friendly structure while keeping the persistence story easy to explain in an interview.

## 3. Why this architecture?

The app is split by responsibility:

- `app/` owns routes and page entry points
- `features/` owns feature-specific UI, schemas, and API clients
- `components/` owns reusable presentation pieces
- `lib/` owns infrastructure and cross-cutting helpers
- `models/` owns database documents
- `store/` owns client-only state

This keeps files small and avoids over-abstraction.

## 4. Trade-offs

- `bcryptjs` was chosen over native `bcrypt` to reduce setup friction in local environments, especially on Windows.
- JWT cookie auth is simple and interview-friendly, but it is not as fully featured as a mature auth platform.
- Dashboard fetching is client-driven for clarity, even though more server-driven data loading could improve initial render behavior.

## 5. One more week improvements

- Add debounced search and optimistic UI polish
- Add integration tests for route handlers
- Add stronger MongoDB indexing for search-heavy queries
- Improve chart empty states and dashboard skeletons
- Introduce audit logs and admin activity history

## 6. Hardest challenge

Balancing production awareness with simplicity was the main challenge. The goal was to make the architecture feel real without introducing extra systems that would be difficult to justify during a machine test.

## 7. AI tools used

Codex was used to scaffold, structure, and implement the MVP foundation.

## 8. Where AI helped

AI accelerated boilerplate setup, repetitive component wiring, and maintaining consistency between schemas, types, and route handlers.

## 9. Where AI was wrong

AI tends to over-abstract or add unnecessary complexity for small scopes. The implementation had to stay disciplined around file size, responsibilities, and the machine-test constraints.

## 10. What breaks at 100k users?

- Regex-based feedback search would become too expensive without indexing and query redesign
- Real-time analytics aggregation on request would become slower and should move toward precomputed summaries
- A single seeded-admin model would not scale for real teams
- Session, observability, and operational controls would need to become more robust

## 11. What to improve, change, or challenge?

I would challenge the reliance on a separate public feedback form page for a CRM product. In a real-world scenario, feedback is usually collected via an in-app widget (like Intercom or a slide-out drawer) to maintain context and reduce friction. The current standalone form is simple but less integrated for the end-user.
