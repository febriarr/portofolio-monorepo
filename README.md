# Monorepo Portfolio

This is my personal portfolio project, built primarily to learn and implement several concepts I've been wanting to explore — especially OOP, Turborepo, and Separation of Concerns.

It might look over-engineered for a portfolio. Honestly, it kind of is. But that's the whole point — I wanted to experience what it feels like to build something with a more structured architecture, not just make features work.

---

## Project Structure

```
monorepo-portofolio/
├── apps/
│   ├── api/                    # REST API (Express + TypeScript)
│   │   └── src/
│   │       ├── config/         # Database, environment
│   │       ├── middlewares/    # Global middlewares
│   │       ├── modules/        # Feature modules (auth, projects, etc)
│   │       ├── routes/         # Route definitions
│   │       ├── shared/         # Base classes, helpers, errors
│   │       └── types/          # Express type extensions
│   └── web/                    # Frontend (Next.js App Router)
│       ├── app/                # Pages
│       ├── components/         # UI components
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Axios client, utilities
│       └── services/           # API service functions
└── packages/
    ├── shared/                 # Shared types & interfaces
    ├── validator/              # Zod schemas
    ├── ui/                     # Shadcn UI components
    ├── eslint-config/          # Shared ESLint config
    └── typescript-config/      # Shared TypeScript config
```

---

## Tech Stack

**Backend**
- Express.js + TypeScript
- Drizzle ORM + PostgreSQL (Supabase)
- JWT Authentication (Access Token + Refresh Token)
- Cloudflare R2 for file storage
- Winston for logging

**Frontend**
- Next.js 16 App Router
- TanStack Query
- React Hook Form + Zod
- Shadcn UI + Tailwind CSS
- Axios

**Monorepo**
- Turborepo
- pnpm workspaces

---

## Why Repository Pattern?

If you're reading this code and wondering why a portfolio needs `BaseRepository`, `BaseService`, and all sorts of abstractions — fair question.

The reason is simple: I wanted to learn how to separate responsibilities at each layer consistently.

- **Repository layer** only deals with the database — queries, inserts, updates, deletes
- **Service layer** only deals with business logic — validation, data transformation, side effects
- **Controller layer** only deals with HTTP — receive requests, send responses

This way each layer can evolve independently. If I ever want to swap the ORM or database, I only need to change the repository without touching the service or controller.

---

## OOP Implementation

This project consistently applies the 4 pillars of OOP:

**Encapsulation** — every dependency is injected through the constructor and marked `private` or `protected`, no direct access from outside the class.

**Inheritance** — `ProjectsRepository` extends `BaseRepository`, `ProjectsService` extends `BaseService`. Common logic like `create`, `update`, `delete` is written once in the base class.

**Polymorphism** — each module can override base methods as needed. `findAll` in `ProjectsService` returns `PaginatedResult`, while `ProjectCategoryService` returns a plain array — both are valid because each has its own contract.

**Abstraction** — `BaseRepository` and `BaseService` are abstract classes that can't be instantiated directly. `findById` and `findAll` must be implemented in subclasses because each entity has different query requirements.

---

## Running the Project

**Prerequisites**
- Node.js 20+
- pnpm 9+

**Install dependencies**
```bash
pnpm install
```

**Setup environment**

Copy the example env files and fill in the values:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

`apps/api/.env`
```bash
DATABASE_URL=url-db
DATABASE_DIRECT_URL=url-db
PORT=8000
NODE_ENV=development-or-production

R2_ACCESS_KEY=access-storage
R2_SECRET_ACCESS_KEY=access-key-storage
R2_ENDPOINT_URL=endpoint
R2_BUCKET_NAME=bucket

JWT_ACCESS_SECRET=random-string-32
JWT_REFRESH_SECRET=random-string-32

CLIENT_URL=url-frontend
DOMAIN=domain-for-cookie
```

`apps/web/.env`
```bash
NEXT_PUBLIC_LINK_R2=public-url-platform-storage

# If using Next.js proxy/rewrites (default setup):
NEXT_PUBLIC_API_URL=/api

# If not using rewrites, set the backend URL directly
# (must be on the same domain as the frontend):
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Database migration & seed**
```bash
pnpm --filter @monorepo/api db:migrate
pnpm --filter @monorepo/api db:seed
```

**Run all apps**
```bash
pnpm dev
```

---

## Deployment

- **Frontend** — Vercel
- **Backend** — Railway
- **Database** — Supabase
- **File Storage** — Cloudflare R2

---

## Notes

This project is still under active development. Some things I still want to add:

- Unit testing for the base classes
- Rate limiting
- API documentation with Swagger