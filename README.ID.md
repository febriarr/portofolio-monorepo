# Monorepo Portofolio

Ini adalah project portofolio pribadi yang saya bangun dengan tujuan utama belajar dan mengimplementasikan beberapa konsep yang selama ini ingin saya eksplorasi lebih dalam — terutama OOP, Turborepo, dan Separation of Concerns.

Mungkin terlihat *over-engineering* untuk sebuah portofolio. Dan jujurnya, memang iya. Tapi justru itu pointnya — saya ingin tahu bagaimana rasanya membangun sesuatu dengan arsitektur yang lebih terstruktur, bukan hanya sekedar membuat fitur jalan.

---

## Struktur Project

```
monorepo-portofolio/
├── apps/
│   ├── api/                    # REST API (Express + TypeScript)
│   │   └── src/
│   │       ├── config/         # Database, environment
│   │       ├── middlewares/    # Global middlewares
│   │       ├── modules/        # Feature modules (auth, projects, dll)
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
- Cloudflare R2 untuk file storage
- Winston untuk logging

**Frontend**
- Next.js 14 App Router
- TanStack Query
- React Hook Form + Zod
- Shadcn UI + Tailwind CSS
- Axios

**Monorepo**
- Turborepo
- pnpm workspaces

---

## Kenapa Pakai Repository Pattern?

Kalau kamu membaca kode ini dan bertanya-tanya kenapa sebuah portofolio perlu `BaseRepository`, `BaseService`, dan segala macam abstraksi — pertanyaan yang wajar.

Alasannya sederhana: saya ingin belajar bagaimana memisahkan tanggung jawab di setiap layer secara konsisten.

- **Repository layer** hanya urusan database — query, insert, update, delete
- **Service layer** hanya urusan business logic — validasi, transformasi data, side effects
- **Controller layer** hanya urusan HTTP — terima request, kirim response

Dengan cara ini setiap layer bisa berkembang secara independen. Kalau suatu saat mau ganti ORM atau database, cukup ubah repository tanpa sentuh service atau controller.

---

## Implementasi OOP

Project ini menerapkan 4 pilar OOP secara konsisten:

**Encapsulation** — setiap dependency di-inject lewat constructor dan ditandai `private` atau `protected`, tidak ada akses langsung dari luar class.

**Inheritance** — `ProjectsRepository` extends `BaseRepository`, `ProjectsService` extends `BaseService`. Logic umum seperti `create`, `update`, `delete` cukup ditulis sekali di base class.

**Polymorphism** — setiap module bisa override method base sesuai kebutuhannya. `findAll` di `ProjectsService` return `PaginatedResult`, sedangkan `ProjectCategoryService` return array biasa — keduanya valid karena masing-masing punya kontrak sendiri.

**Abstraction** — `BaseRepository` dan `BaseService` adalah abstract class yang tidak bisa di-instantiate langsung. `findById` dan `findAll` wajib diimplementasikan di subclass karena setiap entity punya kebutuhan query yang berbeda.

---

## Menjalankan Project

**Prerequisites**
- Node.js 20+
- pnpm 9+

**Install dependencies**
```bash
pnpm install
```

**Setup environment**

Copy file env contoh lalu isi dengan nilai yang sesuai:
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

# Jika menggunakan proxy/rewrites Next.js (setup default):
NEXT_PUBLIC_API_URL=/api

# Jika tidak menggunakan rewrites, set URL backend langsung
# (harus satu domain dengan frontend):
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Migration & seed database**
```bash
pnpm --filter @monorepo/api db:migrate
pnpm --filter @monorepo/api db:seed
```

**Jalankan semua apps**
```bash
pnpm dev
```

---

## Deploy

- **Frontend** — Vercel
- **Backend** — Railway
- **Database** — Supabase
- **File Storage** — Cloudflare R2

---

## Catatan

Project ini masih dalam pengembangan aktif. Beberapa hal yang masih ingin saya tambahkan ke depannya:

- Unit testing untuk base class
- Rate limiting
- API documentation dengan Swagger