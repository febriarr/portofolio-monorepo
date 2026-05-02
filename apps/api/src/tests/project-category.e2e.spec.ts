import { describe, it, expect, afterAll, beforeAll } from "@jest/globals"
import request from "supertest"
import { app } from "@/config/app"
import { db } from "@/config/db"
import { projectCategory } from "@/config/db/schema"
import { eq } from "drizzle-orm"

const BASE_URL = "/api/project-category"

const createdIds: number[] = []

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(projectCategory).where(eq(projectCategory.id, id))
  }
})

describe("ProjectCategory E2E", () => {
  // ─── GET /project-category ────────────────────────────────────────────────

  describe("GET /project-category", () => {
    it("should return list of project categories", async () => {
      const res = await request(app).get(BASE_URL)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  // ─── GET /project-category/:id ────────────────────────────────────────────

  describe("GET /project-category/:id", () => {
    beforeAll(async () => {
      const [created] = await db
        .insert(projectCategory)
        .values({ name: "E2E Test Category" })
        .returning()
      createdIds.push(created!.id)
    })

    it("should return a category by id", async () => {
      const id = createdIds[0]
      const res = await request(app).get(`${BASE_URL}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "E2E Test Category" })
    })

    it("should return 404 when category not found", async () => {
      const res = await request(app).get(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })

  // ─── PATCH /project-category/:id ─────────────────────────────────────────

  describe("PATCH /project-category/:id", () => {
    it("should update a category", async () => {
      const id = createdIds[0]
      const res = await request(app)
        .patch(`${BASE_URL}/${id}`)
        .send({ name: "Updated E2E Category" })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, name: "Updated E2E Category" })
    })

    it("should return 404 when category not found", async () => {
      const res = await request(app).patch(`${BASE_URL}/999999`).send({ name: "Updated" })

      expect(res.status).toBe(404)
    })
  })
})
