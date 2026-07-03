# Acowale CRM Machine

## Overview

Acowale CRM Machine is a production-aware MVP foundation for collecting customer feedback and giving an internal team a protected analytics dashboard. The app focuses on readability, maintainability, and interview explainability over feature sprawl.

## Features

- Public landing page with product positioning and clear calls to action
- Public feedback form with client and server validation
- JWT-based admin authentication with HttpOnly cookies
- Protected dashboard route using Next.js middleware
- Analytics summary with pie and bar charts
- Search, category filter, and pagination for feedback records
- MongoDB persistence with Mongoose models
- Centralized API response helpers and reusable UI primitives
- Basic Jest coverage for validation and utility helpers

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component structure
- Lucide React
- React Hook Form
- Zod
- Zustand
- Sonner
- Recharts
- Mongoose
- JWT with `jose`
- `bcryptjs`
- Jest

## Folder Structure

```text
app/
  (public)/
  api/
  dashboard/
  feedback/
  login/
components/
  charts/
  common/
  ui/
features/
  analytics/
  auth/
  dashboard/
  feedback/
lib/
models/
store/
types/
middleware.ts
README.md
DECISIONS.md
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-long-random-secret
```

## API Summary

- `POST /api/auth/login` authenticate admin and set JWT cookie
- `POST /api/auth/logout` clear session cookie
- `GET /api/auth/me` return current authenticated user
- `POST /api/feedback` create a public feedback record
- `GET /api/feedback` return paginated feedback for admins with `search`, `category`, `page`, and `pageSize`
- `GET /api/analytics` return dashboard summary metrics
- `GET /api/health` return application health

## Screenshots

- Landing page placeholder
- Feedback form placeholder
- Dashboard placeholder

## Future Improvements

- Stronger audit logging for admin actions
- Better dashboard loading and empty states
- Role expansion beyond a single admin account
- Request rate limiting
- Background jobs for analytics snapshots
- CSV or PDF exports
- Monitoring and deployment automation
