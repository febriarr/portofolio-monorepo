import { db } from "@/config/db/index"
import { users, projectCategory, techCategory, techStack } from "./schema/index"
import bcrypt from "bcrypt"
import { config } from "dotenv"

config()

const SALT_ROUNDS = 10

async function seed() {
  console.log("🌱 Seeding database...")

  // ─── User ─────────────────────────────────────────────────────────────────

  console.log("  → Seeding user...")

  const hashedPassword = await bcrypt.hash(process.env.PASSWORD_USER!, SALT_ROUNDS)

  await db
    .insert(users)
    .values({
      username: "febri",
      password: hashedPassword,
    })
    .onConflictDoNothing({ target: users.username })

  console.log("  ✓ User seeded (username: febri, password: admin123)")

  // ─── Project Categories ───────────────────────────────────────────────────

  console.log("  → Seeding project categories...")

  await db
    .insert(projectCategory)
    .values([
      { name: "Web Development" },
      { name: "Mobile Development" },
      { name: "Desktop Application" },
      { name: "UI/UX Design" },
      { name: "Open Source" },
    ])
    .onConflictDoNothing()

  console.log("  ✓ Project categories seeded")

  // ─── Tech Categories ──────────────────────────────────────────────────────

  console.log("  → Seeding tech categories...")

  const [frontend, backend, database, devops, mobile, tools] = await db
    .insert(techCategory)
    .values([
      { name: "Frontend" },
      { name: "Backend" },
      { name: "Database" },
      { name: "DevOps" },
      { name: "Mobile" },
      { name: "Tools" },
    ])
    .onConflictDoNothing()
    .returning()

  console.log("  ✓ Tech categories seeded")

  // ─── Tech Stacks ──────────────────────────────────────────────────────────

  console.log("  → Seeding tech stacks...")

  await db
    .insert(techStack)
    .values([
      // Frontend
      { name: "React", techCategoryId: frontend?.id },
      { name: "Next.js", techCategoryId: frontend?.id },
      { name: "Vue.js", techCategoryId: frontend?.id },
      { name: "TypeScript", techCategoryId: frontend?.id },
      { name: "Tailwind CSS", techCategoryId: frontend?.id },

      // Backend
      { name: "Node.js", techCategoryId: backend?.id },
      { name: "NestJS", techCategoryId: backend?.id },
      { name: "Express", techCategoryId: backend?.id },
      { name: "Go", techCategoryId: backend?.id },

      // Database
      { name: "PostgreSQL", techCategoryId: database?.id },
      { name: "MySQL", techCategoryId: database?.id },
      { name: "MongoDB", techCategoryId: database?.id },
      { name: "Redis", techCategoryId: database?.id },
      { name: "Drizzle ORM", techCategoryId: database?.id },
      { name: "Prisma", techCategoryId: database?.id },

      // DevOps
      { name: "Docker", techCategoryId: devops?.id },
      { name: "GitHub Actions", techCategoryId: devops?.id },
      { name: "Cloudflare", techCategoryId: devops?.id },

      // Mobile
      { name: "React Native", techCategoryId: mobile?.id },
      { name: "Expo", techCategoryId: mobile?.id },

      // Tools
      { name: "Git", techCategoryId: tools?.id },
      { name: "Figma", techCategoryId: tools?.id },
      { name: "Turborepo", techCategoryId: tools?.id },
    ])
    .onConflictDoNothing()

  console.log("  ✓ Tech stacks seeded")

  console.log("\n✅ Seeding complete!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})
