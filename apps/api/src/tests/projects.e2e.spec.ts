import { jest } from "@jest/globals"
import request from "supertest"
import { app } from "@/config/app"
import { db } from "@/config/db"
import { projects } from "@/config/db/schema"

describe("Projects E2E", () => {
  let createdId: number

  afterAll(async () => {
    // Cleanup semua data test
    await db.delete(projects)
  })

  describe("GET /api/projects", () => {
    it("should return 200 with empty array initially", async () => {
      const res = await request(app).get("/api/projects")

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("data")
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe("POST /api/projects", () => {
    it("should return 400 if title is missing", async () => {
      const res = await request(app).post("/api/projects").send({ shortDescription: "No title" })

      expect(res.status).toBe(400)
    })

    it("should create project with title only and return 201", async () => {
      const res = await request(app).post("/api/projects").send({ title: "Test Project" })

      expect(res.status).toBe(201)
      expect(res.body.data).toHaveProperty("id")
      expect(res.body.data.title).toBe("Test Project")

      createdId = res.body.data.id
    })

    it("should create project with all fields and return 201", async () => {
      const res = await request(app).post("/api/projects").send({
        title: "Full Project",
        shortDescription: "Short desc",
        description: "Full description here",
        liveUrl: "https://example.com",
        linkRepo: "https://github.com/example",
      })

      expect(res.status).toBe(201)
      expect(res.body.data).toHaveProperty("id")
      expect(res.body.data.title).toBe("Full Project")
      expect(res.body.data.liveUrl).toBe("https://example.com")
    })
  })

  describe("GET /api/projects/:id", () => {
    it("should return 200 with project by id", async () => {
      const res = await request(app).get(`/api/projects/${createdId}`)

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty("id", createdId)
      expect(res.body.data.title).toBe("Test Project")
    })

    it("should return 404 if project not found", async () => {
      const res = await request(app).get("/api/projects/99999")

      expect(res.status).toBe(404)
    })

    it("should return 400 if id is not a number", async () => {
      const res = await request(app).get("/api/projects/abc")

      expect(res.status).toBe(400)
    })
  })

  describe("PATCH /api/projects/:id", () => {
    it("should update project title and return 200", async () => {
      const res = await request(app)
        .patch(`/api/projects/${createdId}`)
        .send({ title: "Updated Project" })

      expect(res.status).toBe(200)
      expect(res.body.data.title).toBe("Updated Project")
    })

    it("should update partial fields only", async () => {
      const res = await request(app)
        .patch(`/api/projects/${createdId}`)
        .send({ liveUrl: "https://updated.com" })

      expect(res.status).toBe(200)
      expect(res.body.data.liveUrl).toBe("https://updated.com")
      // title tetap tidak berubah
      expect(res.body.data.title).toBe("Updated Project")
    })

    it("should return 404 if project not found", async () => {
      const res = await request(app).patch("/api/projects/99999").send({ title: "Ghost" })

      expect(res.status).toBe(404)
    })
  })

  describe("DELETE /api/projects/:id", () => {
    it("should return 404 if project not found", async () => {
      const res = await request(app).delete("/api/projects/99999")

      expect(res.status).toBe(404)
    })

    it("should delete project and return 200", async () => {
      const res = await request(app).delete(`/api/projects/${createdId}`)

      expect(res.status).toBe(200)
    })

    it("should return 404 after deleted", async () => {
      const res = await request(app).get(`/api/projects/${createdId}`)

      expect(res.status).toBe(404)
    })
  })
})
