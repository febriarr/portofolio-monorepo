# API Architecture

Backend API built with:

* Express
* TypeScript
* Drizzle ORM
* PostgreSQL
* Turborepo

This project intentionally applies:

* Object-Oriented Programming (OOP)
* Manual Dependency Injection (DI)
* Repository Pattern
* Modular Feature Architecture
* Layered Separation of Concerns

The goal of this architecture is not only scalability, but also to demonstrate clean engineering practices, maintainability, and production-style backend structure.

---

# Folder Structure

```txt
src/
│
├── config/
├── modules/
├── middlewares/
├── shared/
├── routes/
├── types/
└── server.ts
```

---

# Architecture Overview

The application follows this request flow:

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

Each layer has a single responsibility to keep the codebase clean and maintainable.

---

# Folder Explanation

---

## `config/`

Application-level configuration.

Contains global setup and initialization logic such as:

```txt
config/
├── app.ts
├── database.ts
└── env.ts
```

### Purpose

* Initialize Express app
* Setup database connection
* Validate environment variables
* Centralize application configuration

---

## `modules/`

Feature-based modular architecture.

Each feature is isolated into its own module.

Example:

```txt
modules/
└── user/
    ├── dto/
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.repository.ts
    ├── user.route.ts
    ├── user.validation.ts
    ├── user.types.ts
    └── index.ts
```

### Purpose

* Better scalability
* Easier maintenance
* Clear feature boundaries
* Prevent large monolithic folders

---

# Layer Responsibilities

---

## Controller Layer

Handles:

* HTTP request
* HTTP response
* Request parsing
* Calling services

Controllers should remain thin and contain no business logic.

---

## Service Layer

Contains:

* Business logic
* Application rules
* Data orchestration

Services communicate with repositories and coordinate application behavior.

---

## Repository Layer

Handles:

* Database queries
* ORM interaction
* Data persistence

Repositories isolate database access from business logic.

---

## DTO Layer

DTO (Data Transfer Object) acts as a contract between layers.

Purpose:

* Strong typing
* Predictable data flow
* Safer service input

---

## Validation Layer

Uses Zod for request validation.

Purpose:

* Runtime validation
* Type safety
* Consistent API input validation

---

## `middlewares/`

Contains reusable Express middlewares.

Example:

```txt
middlewares/
├── auth.middleware.ts
├── error.middleware.ts
└── validate.middleware.ts
```

### Purpose

* Centralized error handling
* Authentication
* Validation handling
* Reusable request processing

---

## `shared/`

Contains reusable application-wide utilities and abstractions.

Example:

```txt
shared/
├── constants/
├── errors/
├── helpers/
└── types/
```

### Purpose

* Shared reusable logic
* Prevent duplicated code
* Centralize common utilities

---

## `routes/`

Centralized route registration.

Example:

```txt
routes/
└── index.ts
```

### Purpose

* Aggregate module routes
* Keep app configuration clean

---

## `types/`

Contains custom TypeScript global types.

Example:

```txt
types/
└── express.d.ts
```

### Purpose

* Extend Express request types
* Global type declarations

---

# Dependency Injection (DI)

This project uses manual Dependency Injection.

Example:

```ts
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)
```

### Purpose

* Loose coupling
* Better testability
* Clear dependency flow
* Easier maintenance

---

# Why This Architecture?

This structure is intentionally designed to:

* Demonstrate clean backend engineering
* Apply OOP principles properly
* Improve scalability and maintainability
* Separate business logic from infrastructure
* Simulate production-grade architecture

Even though this is a portfolio project, the architecture reflects real-world backend development practices.

---

# Development Philosophy

This project prioritizes:

* Readability
* Maintainability
* Explicit architecture
* Clear responsibility boundaries
* Type safety
* Consistent structure

The goal is not simply making the API work, but building it with clean engineering practices.
