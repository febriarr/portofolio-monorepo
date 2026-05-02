import { jest, describe, it, expect, afterAll, beforeAll } from "@jest/globals"
import request from "supertest"
import { app } from "@/config/app"
import { db } from "@/config/db"
import { techStack, techCategory } from "@/config/db/schema"
import { eq } from "drizzle-orm"

const BASE_URL = "/api/tech-stacks"

const createdStackIds: number[] = []
let seededCategoryId: number

beforeAll(async () => {
  const [category] = await db
    .insert(techCategory)
    .values({ name: "E2E TechStack Category" })
    .returning()
  seededCategoryId = category!.id
})

afterAll(async () => {
  // Hapus stacks dulu, baru category (FK: techStack.techCategoryId → techCategory.id)
  for (const id of createdStackIds) {
    await db.delete(techStack).where(eq(techStack.id, id))
  }
  await db.delete(techCategory).where(eq(techCategory.id, seededCategoryId))
})

describe("TechStacks E2E", () => {
  // ─── POST /tech-stacks/create ─────────────────────────────────────────────

  describe("POST /tech-stacks/create", () => {
    it("should create a tech stack", async () => {
      const res = await request(app)
        .post(`${BASE_URL}/create`)
        .send({ name: "E2E React", techCategoryId: String(seededCategoryId) })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ name: "E2E React" })
      expect(res.body.data.id).toBeDefined()

      createdStackIds.push(res.body.data.id)
    })

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post(`${BASE_URL}/create`).send({})

      expect(res.status).toBe(400)
    })
  })

  // ─── POST /tech-stacks/create/with-image (mocked upload) ─────────────────

  describe("POST /tech-stacks/create/with-image", () => {
    it("should create a tech stack with image upload", async () => {
      const { ImageService } = await import("@/shared/cloudflare/image.service")
      jest.spyOn(ImageService.prototype, "createImage").mockResolvedValue({
        path: "mocked/vue-logo.webp",
      } as any)

      const res = await request(app)
        .post(`${BASE_URL}/create/with-image`)
        .field("name", "E2E Vue")
        .field("techCategoryId", String(seededCategoryId))
        .attach("image", Buffer.from("fake-image-data"), {
          filename: "vue.png",
          contentType: "image/png",
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ name: "E2E Vue" })
      expect(res.body.data.id).toBeDefined()

      createdStackIds.push(res.body.data.id)

      jest.restoreAllMocks()
    })
  })

  // ─── GET /tech-stacks ─────────────────────────────────────────────────────

  describe("GET /tech-stacks", () => {
    it("should return list of tech stacks", async () => {
      const res = await request(app).get(BASE_URL)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  // ─── GET /tech-stacks/:id ─────────────────────────────────────────────────

  describe("GET /tech-stacks/:id", () => {
    it("should return a tech stack by id", async () => {
      const id = createdStackIds[0]
      const res = await request(app).get(`${BASE_URL}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "E2E React" })
    })

    it("should return 404 when not found", async () => {
      const res = await request(app).get(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })

  // ─── PATCH /tech-stacks/:id ───────────────────────────────────────────────

  describe("PATCH /tech-stacks/:id", () => {
    it("should update a tech stack", async () => {
      const id = createdStackIds[0]
      const res = await request(app).patch(`${BASE_URL}/${id}`).send({ name: "E2E React Updated" })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "E2E React Updated" })
    })

    it("should return 404 when not found", async () => {
      const res = await request(app).patch(`${BASE_URL}/999999`).send({ name: "Updated" })

      expect(res.status).toBe(404)
    })
  })

  // ─── DELETE /tech-stacks/:id ──────────────────────────────────────────────

  describe("DELETE /tech-stacks/:id", () => {
    it("should delete a tech stack", async () => {
      const [seeded] = await db.insert(techStack).values({ name: "To Be Deleted" }).returning()

      const res = await request(app).delete(`${BASE_URL}/${seeded!.id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBeDefined()
    })

    it("should return 404 when not found", async () => {
      const res = await request(app).delete(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })
})
