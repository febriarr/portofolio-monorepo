# Monorepo Portfolio

A modern fullstack monorepo project built with a scalable and maintainable architecture using TypeScript across the entire stack.

The purpose of this repository is not only to build features, but also to apply real-world engineering practices such as modular architecture, shared contracts, dependency injection, reusable tooling configuration, and type-safe development.

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* App Router
* shadcn/ui

---

## Backend

* Express
* Drizzle ORM
* PostgreSQL
* OOP Architecture
* Repository Pattern
* Dependency Injection

---

## Shared Tooling

* Turborepo
* TypeScript
* Zod
* ESLint
* Prettier
* pnpm workspace

---

# Repository Structure

```txt
.
├── apps
│   ├── api
│   └── web
│
├── packages
│   ├── eslint-config
│   ├── shared
│   ├── typescript-config
│   ├── ui
│   └── validator
│
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
└── turbo.json
```

---

# Applications

## `apps/api`

Backend API application.

Built using Express and structured with a layered architecture to keep responsibilities separated and maintainable.

### Main Concepts

* Modular feature-based structure
* OOP approach
* Manual dependency injection
* Repository pattern
* Centralized error handling
* Shared validation contracts
* Typed environment configuration

### Architecture Flow

```txt
Request
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database
```

---

## `apps/web`

Frontend application built with Next.js.

Consumes shared validators, shared contracts, and shared UI components from the workspace packages to keep frontend and backend synchronized.

---

# Workspace Packages

## `packages/eslint-config`

Shared ESLint configuration used across the entire monorepo.

This keeps lint rules centralized and consistent between applications and packages.

---

## `packages/typescript-config`

Shared TypeScript configuration.

Provides reusable compiler settings and keeps TypeScript behavior consistent across all workspaces.

---

## `packages/shared`

Contains reusable shared types and constants used by both frontend and backend.

Examples:

* API response types
* error response types
* pagination metadata
* utility types
* shared constants

This package acts as a shared contract layer between applications.

---

## `packages/validator`

Shared validation schemas built with Zod.

The frontend and backend both consume the same schemas and inferred types to avoid duplicated validation logic and inconsistent DTO definitions.

### Benefits

* single source of truth
* shared DTO inference
* runtime validation
* end-to-end type safety

---

## `packages/ui`

Shared UI components used by the frontend application.

Built using shadcn/ui and intended to keep the design system reusable and consistent.

---

# Monorepo Approach

This repository follows a workspace-based architecture where applications and reusable packages are separated by responsibility.

The goal of this structure is to improve:

* maintainability
* scalability
* code reuse
* consistency
* developer experience

---

# Shared Contract Philosophy

Instead of duplicating types between frontend and backend, shared contracts are extracted into dedicated packages.

Example flow:

```txt
packages/validator
        ↓
schema + inferred types
        ↓
apps/api + apps/web
```

and:

```txt
packages/shared
        ↓
shared response contracts
        ↓
apps/api + apps/web
```

This keeps the fullstack application synchronized while reducing duplicated logic.

---

# Development Philosophy

This project intentionally focuses on engineering quality and maintainable architecture rather than only implementing features.

Some principles applied in this repository:

* separation of concerns
* reusable abstractions
* centralized configuration
* consistent structure
* type-safe development
* modular architecture
* explicit responsibility boundaries

---

# Goals

The purpose of this repository is to explore and implement modern fullstack architecture patterns using a monorepo approach.

It also serves as a personal portfolio project to demonstrate:

* scalable project organization
* backend architecture design
* shared contract architecture
* reusable tooling configuration
* modern TypeScript development workflow

---

# License

MIT
