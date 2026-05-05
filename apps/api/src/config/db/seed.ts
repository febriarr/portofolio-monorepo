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
      { name: "Frontend" },
      { name: "Backend" },
      { name: "Fullstack" },
      { name: "Mobile Apps" },
      { name: "Open Source" },
    ])
    .onConflictDoNothing()

  console.log("  ✓ Project categories seeded")

  // ─── Tech Categories ──────────────────────────────────────────────────────

  console.log("  → Seeding tech categories...")

  await db
    .insert(techCategory)
    .values([{ name: "Frontend" }, { name: "Backend" }, { name: "Database" }, { name: "Tools" }])
    .onConflictDoNothing()
    .returning()

  console.log("  ✓ Tech categories seeded")

  // ─── Tech Stacks ──────────────────────────────────────────────────────────

  console.log("  → Seeding tech stacks...")

  console.log("\n✅ Seeding complete!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})
