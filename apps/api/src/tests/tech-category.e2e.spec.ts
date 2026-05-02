import { describe, it, expect, afterAll, beforeAll } from "@jest/globals"
import request from "supertest"
import { app } from "@/config/app"
import { db } from "@/config/db"
import { techCategory } from "@/config/db/schema"
import { eq } from "drizzle-orm"

const BASE_URL = "/api/tech-category"

const createdIds: number[] = []

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(techCategory).where(eq(techCategory.id, id))
  }
})

describe("TechCategory E2E", () => {
  // ─── POST /tech-category ──────────────────────────────────────────────────

  describe("POST /tech-category", () => {
    it("should create a tech category", async () => {
      const res = await request(app).post(BASE_URL).send({ name: "E2E Frontend" })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ name: "E2E Frontend" })
      expect(res.body.data.id).toBeDefined()

      createdIds.push(res.body.data.id)
    })

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post(BASE_URL).send({})

      expect(res.status).toBe(400)
    })
  })

  // ─── GET /tech-category ───────────────────────────────────────────────────

  describe("GET /tech-category", () => {
    it("should return list of tech categories", async () => {
      const res = await request(app).get(BASE_URL)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  // ─── GET /tech-category/:id ───────────────────────────────────────────────

  describe("GET /tech-category/:id", () => {
    it("should return a tech category by id", async () => {
      const id = createdIds[0]
      const res = await request(app).get(`${BASE_URL}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "E2E Frontend" })
    })

    it("should return 404 when tech category not found", async () => {
      const res = await request(app).get(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })

  // ─── PATCH /tech-category/:id ─────────────────────────────────────────────

  describe("PATCH /tech-category/:id", () => {
    it("should update a tech category", async () => {
      const id = createdIds[0]
      const res = await request(app).patch(`${BASE_URL}/${id}`).send({ name: "E2E Backend" })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "E2E Backend" })
    })

    it("should return 404 when tech category not found", async () => {
      const res = await request(app).patch(`${BASE_URL}/999999`).send({ name: "Updated" })

      expect(res.status).toBe(404)
    })
  })

  // ─── DELETE /tech-category/:id ────────────────────────────────────────────

  describe("DELETE /tech-category/:id", () => {
    it("should delete a tech category", async () => {
      const [seeded] = await db.insert(techCategory).values({ name: "To Be Deleted" }).returning()

      const res = await request(app).delete(`${BASE_URL}/${seeded!.id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBeDefined()
    })

    it("should return 404 when tech category not found", async () => {
      const res = await request(app).delete(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })
})
