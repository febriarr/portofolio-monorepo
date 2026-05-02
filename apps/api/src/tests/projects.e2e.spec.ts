import { jest, describe, it, expect, afterAll, beforeAll } from "@jest/globals"
import request from "supertest"
import { app } from "@/config/app"
import { db } from "@/config/db"
import {
  projects,
  projectImages,
  projectTechStacks,
  projectCategory,
  techStack,
} from "@/config/db/schema"
import { eq } from "drizzle-orm"

const BASE_URL = "/api/projects"

const createdProjectIds: number[] = []
let seededCategoryId: number
let seededTechStackId: number

beforeAll(async () => {
  const [category] = await db
    .insert(projectCategory)
    .values({ name: "E2E Project Category" })
    .returning()
  seededCategoryId = category!.id

  const [stack] = await db.insert(techStack).values({ name: "E2E TechStack" }).returning()
  seededTechStackId = stack!.id
})

afterAll(async () => {
  // Urutan delete sesuai FK:
  // 1. projectTechStacks (FK → projects, techStack)
  // 2. projectImages     (FK → projects)
  // 3. projects          (FK → projectCategory)
  // 4. techStack         (FK → techCategory)
  // 5. projectCategory
  for (const id of createdProjectIds) {
    await db.delete(projectTechStacks).where(eq(projectTechStacks.projectId, id))
    await db.delete(projectImages).where(eq(projectImages.projectId, id))
    await db.delete(projects).where(eq(projects.id, id))
  }
  await db.delete(techStack).where(eq(techStack.id, seededTechStackId))
  await db.delete(projectCategory).where(eq(projectCategory.id, seededCategoryId))
})

describe("Projects E2E", () => {
  // ─── POST /projects ───────────────────────────────────────────────────────

  describe("POST /projects", () => {
    it("should create a project with minimal payload", async () => {
      const res = await request(app).post(BASE_URL).send({ title: "E2E Project" })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ title: "E2E Project" })
      expect(res.body.data.id).toBeDefined()

      createdProjectIds.push(res.body.data.id)
    })

    it("should create a project with full payload", async () => {
      const res = await request(app)
        .post(BASE_URL)
        .send({
          title: "E2E Full Project",
          shortDescription: "Short description here",
          description: "Full description here for the project",
          liveUrl: "https://example.com",
          linkRepo: "https://github.com/user/repo",
          categoryId: seededCategoryId,
          techStackIds: [seededTechStackId],
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ title: "E2E Full Project" })

      createdProjectIds.push(res.body.data.id)
    })

    it("should return 400 when title is missing", async () => {
      const res = await request(app).post(BASE_URL).send({})

      expect(res.status).toBe(400)
    })

    it("should return 400 when shortDescription is too short", async () => {
      const res = await request(app)
        .post(BASE_URL)
        .send({ title: "E2E Project", shortDescription: "abc" })

      expect(res.status).toBe(400)
    })
  })

  // ─── POST /projects/with-images (mocked upload) ───────────────────────────

  describe("POST /projects/with-images", () => {
    it("should create a project with image upload", async () => {
      const { ImageService } = await import("@/shared/cloudflare/image.service")
      jest
        .spyOn(ImageService.prototype, "createImages")
        .mockResolvedValue([{ path: "mocked/project-img1.webp" }] as any)

      const res = await request(app)
        .post(`${BASE_URL}/with-images`)
        .field("title", "E2E Project With Image")
        .attach("images", Buffer.from("fake-image-data"), {
          filename: "cover.png",
          contentType: "image/png",
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ title: "E2E Project With Image" })

      createdProjectIds.push(res.body.data.id)

      jest.restoreAllMocks()
    })
  })

  // ─── GET /projects ────────────────────────────────────────────────────────
  // Response shape: { success, message, data: ProjectWithMeta[], meta: { total, page, limit } }

  describe("GET /projects", () => {
    it("should return paginated projects with defaults", async () => {
      const res = await request(app).get(BASE_URL)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.meta).toMatchObject({
        total: expect.any(Number),
        page: 1,
        limit: 6,
      })
    })

    it("should return filtered projects by search", async () => {
      const res = await request(app).get(`${BASE_URL}?search=E2E`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ title: expect.stringContaining("E2E") })])
      )
    })

    it("should return filtered projects by categoryId", async () => {
      const res = await request(app).get(`${BASE_URL}?categoryId=${seededCategoryId}`)

      expect(res.status).toBe(200)
      expect(res.body.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ categoryId: seededCategoryId })])
      )
    })

    it("should respect page and limit params", async () => {
      const res = await request(app).get(`${BASE_URL}?page=1&limit=2`)

      expect(res.status).toBe(200)
      expect(res.body.meta.page).toBe(1)
      expect(res.body.meta.limit).toBe(2)
      expect(res.body.data.length).toBeLessThanOrEqual(2)
    })

    it("should return 400 when page is negative", async () => {
      const res = await request(app).get(`${BASE_URL}?page=-1`)

      expect(res.status).toBe(400)
    })
  })

  // ─── GET /projects/:id ────────────────────────────────────────────────────

  describe("GET /projects/:id", () => {
    it("should return a project by id", async () => {
      const id = createdProjectIds[0]
      const res = await request(app).get(`${BASE_URL}/${id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id })
    })

    it("should return 404 when project not found", async () => {
      const res = await request(app).get(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })

  // ─── PATCH /projects/:id ──────────────────────────────────────────────────

  describe("PATCH /projects/:id", () => {
    it("should update a project", async () => {
      const id = createdProjectIds[0]
      const res = await request(app)
        .patch(`${BASE_URL}/${id}`)
        .send({ title: "E2E Project Updated" })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id, title: "E2E Project Updated" })
    })

    it("should return 404 when project not found", async () => {
      const res = await request(app).patch(`${BASE_URL}/999999`).send({ title: "Updated" })

      expect(res.status).toBe(404)
    })

    it("should return 400 when deletedImagePaths contains path traversal", async () => {
      const id = createdProjectIds[0]
      const res = await request(app)
        .patch(`${BASE_URL}/${id}`)
        .send({ deletedImagePaths: ["../etc/passwd"] })

      expect(res.status).toBe(400)
    })
  })

  // ─── PATCH /projects/:id/with-images (mocked upload) ─────────────────────

  describe("PATCH /projects/:id/with-images", () => {
    it("should update a project with new image upload", async () => {
      const { ImageService } = await import("@/shared/cloudflare/image.service")
      jest
        .spyOn(ImageService.prototype, "createImages")
        .mockResolvedValue([{ path: "mocked/new-cover.webp" }] as any)
      jest.spyOn(ImageService.prototype, "deleteImages").mockResolvedValue(undefined as any)

      const id = createdProjectIds[0]
      const res = await request(app)
        .patch(`${BASE_URL}/${id}/with-images`)
        .field("title", "E2E Project With New Image")
        .attach("images", Buffer.from("fake-image-data"), {
          filename: "new-cover.png",
          contentType: "image/png",
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toMatchObject({ id })

      jest.restoreAllMocks()
    })
  })

  // ─── DELETE /projects/:id ─────────────────────────────────────────────────
  // controller tidak return data, hanya message

  describe("DELETE /projects/:id", () => {
    it("should delete a project", async () => {
      const [seeded] = await db.insert(projects).values({ title: "To Be Deleted" }).returning()

      const res = await request(app).delete(`${BASE_URL}/${seeded!.id}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe("Project deleted successfully")
      expect(res.body.data).toBeUndefined()
    })

    it("should return 404 when project not found", async () => {
      const res = await request(app).delete(`${BASE_URL}/999999`)

      expect(res.status).toBe(404)
    })
  })
})
