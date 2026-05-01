import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import { ProjectsService } from "@/modules/projects/projects.service"
import type { ProjectsRepository } from "@/modules/projects/projects.repository"
import type { ImageService } from "@/shared/cloudflare/image.service"
import { ZodError } from "zod"
import { ProjectCategories, ProjectWithMeta, TechStack } from "@workspace/shared"
import { ImageResult } from "@/shared/cloudflare/image-type"

const mockRepository = {
  create: jest.fn<ProjectsRepository["create"]>(),
  update: jest.fn<ProjectsRepository["update"]>(),
  findById: jest.fn<ProjectsRepository["findById"]>(),
  findAll: jest.fn<ProjectsRepository["findAll"]>(),
  findByIdWithDetail: jest.fn<ProjectsRepository["findByIdWithDetail"]>(),
  deleteImages: jest.fn<ProjectsRepository["deleteImages"]>(),
  delete: jest.fn<ProjectsRepository["delete"]>(),
}

const mockImageService = {
  createImage: jest.fn<ImageService["createImage"]>(),
  createImages: jest.fn<ImageService["createImages"]>(),
  deleteImages: jest.fn<ImageService["deleteImages"]>(),
}

jest.mock("@/modules/projects/projects.repository", () => ({
  ProjectsRepository: jest.fn().mockImplementation(() => mockRepository),
}))

jest.mock("@/shared/cloudflare/image.service", () => ({
  ImageService: jest.fn().mockImplementation(() => mockImageService),
}))

describe("ProjectsService", () => {
  let service: ProjectsService

  const mockProject = {
    id: 1,
    title: "My Portfolio",
    shortDescription: "A cool portfolio",
    description: "Full description here",
    liveUrl: "https://example.com",
    linkRepo: "https://github.com/user/repo",
    categoryId: 1,
    images: [],
    techStackIds: [],
  } as unknown as ProjectWithMeta

  const mockProjectDetails = {
    id: 1,
    title: "My Portfolio",
    category: { id: 1, name: "Web" } as unknown as ProjectCategories,
    images: [],
    techStacks: [
      {
        techStack: {
          id: 1,
          name: "React",
          techCategoryId: "1",
          logo: null,
        } as unknown as TechStack,
      },
    ],
  } as unknown as ProjectWithMeta

  const mockFile = {
    originalname: "cover.png",
    mimetype: "image/png",
    buffer: Buffer.from("fake"),
    size: 2000,
  } as Express.Multer.File

  beforeEach(() => {
    jest.clearAllMocks()
    service = new ProjectsService(
      mockRepository as unknown as ProjectsRepository,
      mockImageService as unknown as ImageService
    )
  })

  describe("create", () => {
    it("should create a project with valid payload", async () => {
      mockRepository.create.mockResolvedValue(mockProject)

      const result = await service.create({ title: "My Portfolio" })

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "My Portfolio" })
      )
      expect(result).toEqual(mockProject)
    })

    it("should create with all optional fields", async () => {
      mockRepository.create.mockResolvedValue(mockProject)

      const payload = {
        title: "My Portfolio",
        shortDescription: "Short desc",
        description: "Long description",
        liveUrl: "https://example.com",
        linkRepo: "https://github.com/user/repo",
        categoryId: 1,
        techStackIds: [1, 2],
      }

      await service.create(payload)

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(payload))
    })

    it("should throw ZodError when title is missing", async () => {
      await expect(service.create({} as any)).rejects.toThrow(ZodError)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it("should throw ZodError when shortDescription is too short", async () => {
      await expect(service.create({ title: "X", shortDescription: "abc" })).rejects.toThrow(
        ZodError
      )
    })
  })

  describe("update", () => {
    it("should update a project with valid payload", async () => {
      const updated = { ...mockProject, title: "Updated Title" }
      mockRepository.update.mockResolvedValue(updated)

      const result = await service.update(1, { title: "Updated Title" })

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: "Updated Title" })
      )
      expect(result).toEqual(updated)
    })

    it("should allow partial update with empty object", async () => {
      mockRepository.update.mockResolvedValue(mockProject)

      await service.update(1, {})

      expect(mockRepository.update).toHaveBeenCalled()
    })

    it("should pass deletedImagePaths in update payload", async () => {
      mockRepository.update.mockResolvedValue(mockProject)

      await service.update(1, { deletedImagePaths: ["uploads/old.webp"] })

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ deletedImagePaths: ["uploads/old.webp"] })
      )
    })

    it("should throw ZodError when deletedImagePaths contains path traversal", async () => {
      await expect(service.update(1, { deletedImagePaths: ["../etc/passwd"] })).rejects.toThrow(
        ZodError
      )
    })
  })

  describe("findById", () => {
    it("should return a project by id", async () => {
      mockRepository.findById.mockResolvedValue(mockProject)

      const result = await service.findById(1)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockProject)
    })

    it("should propagate error when not found", async () => {
      mockRepository.findById.mockRejectedValue(new Error("Not found"))

      await expect(service.findById(99)).rejects.toThrow("Not found")
    })
  })

  describe("findByIdWithDetail", () => {
    it("should return project with full details", async () => {
      mockRepository.findByIdWithDetail.mockResolvedValue(mockProjectDetails)

      const result = await service.findByIdWithDetail(1)

      expect(mockRepository.findByIdWithDetail).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockProjectDetails)
    })
  })

  describe("findAll", () => {
    beforeEach(() => {
      mockRepository.findAll.mockResolvedValue({ data: [mockProject], total: 1 })
    })

    it("should return paginated result with defaults when no filter provided", async () => {
      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 6 })
      )
      expect(result).toEqual({ data: [mockProject], total: 1, page: 1, limit: 6 })
    })

    it("should apply search and categoryId filter", async () => {
      await service.findAll({ search: "portfolio", categoryId: 1, page: 1, limit: 6 })

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: "portfolio", categoryId: 1 })
      )
    })

    it("should coerce string page and limit to numbers", async () => {
      await service.findAll({ page: "2" as any, limit: "10" as any })

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      )
    })

    it("should throw ZodError when page is negative", async () => {
      await expect(service.findAll({ page: -1, limit: 20 })).rejects.toThrow(ZodError)
    })
  })

  describe("delete", () => {
    it("should delete a project by id", async () => {
      mockRepository.delete.mockResolvedValue(mockProject)

      const result = await service.delete(1)

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockProject)
    })
  })

  describe("createWithImages", () => {
    it("should create project without images when none provided", async () => {
      mockRepository.create.mockResolvedValue(mockProject)

      const result = await service.createWithImages({ title: "My Portfolio" })

      expect(mockImageService.createImages).not.toHaveBeenCalled()
      expect(mockRepository.create).toHaveBeenCalled()
      expect(result).toEqual(mockProject)
    })

    it("should upload images and attach them before creating", async () => {
      mockImageService.createImages.mockResolvedValue([
        { path: "uploads/img1.webp" },
        { path: "uploads/img2.webp" },
      ] as ImageResult[])
      mockRepository.create.mockResolvedValue(mockProject)

      await service.createWithImages({ title: "My Portfolio" }, [mockFile, mockFile])

      expect(mockImageService.createImages).toHaveBeenCalledWith([
        { file: mockFile },
        { file: mockFile },
      ])
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          images: [{ imageUrl: "uploads/img1.webp" }, { imageUrl: "uploads/img2.webp" }],
        })
      )
    })

    it("should throw ZodError when title is missing", async () => {
      await expect(service.createWithImages({} as any)).rejects.toThrow(ZodError)
      expect(mockImageService.createImages).not.toHaveBeenCalled()
    })
  })

  describe("updateWithImages", () => {
    it("should update without touching images when none provided", async () => {
      mockRepository.update.mockResolvedValue(mockProject)

      await service.updateWithImages(1, { title: "Updated" })

      expect(mockImageService.createImages).not.toHaveBeenCalled()
      expect(mockImageService.deleteImages).not.toHaveBeenCalled()
      expect(mockRepository.deleteImages).not.toHaveBeenCalled()
      expect(mockRepository.update).toHaveBeenCalled()
    })

    it("should delete old images from storage and db when deletedImagePaths provided", async () => {
      mockRepository.update.mockResolvedValue(mockProject)

      await service.updateWithImages(1, {
        title: "Updated",
        deletedImagePaths: ["uploads/old1.webp", "uploads/old2.webp"],
      })

      expect(mockImageService.deleteImages).toHaveBeenCalledWith([
        "uploads/old1.webp",
        "uploads/old2.webp",
      ])
      expect(mockRepository.deleteImages).toHaveBeenCalledWith([
        "uploads/old1.webp",
        "uploads/old2.webp",
      ])
    })

    it("should run storage and db deletion in parallel", async () => {
      mockRepository.update.mockResolvedValue(mockProject)
      const resolveOrder: string[] = []

      mockImageService.deleteImages.mockImplementation(async () => {
        resolveOrder.push("storage")
      })
      mockRepository.deleteImages.mockImplementation(async () => {
        resolveOrder.push("db")
      })

      await service.updateWithImages(1, {
        title: "Updated",
        deletedImagePaths: ["uploads/old.webp"],
      })

      expect(resolveOrder).toContain("storage")
      expect(resolveOrder).toContain("db")
    })

    it("should upload new images and attach before updating", async () => {
      mockImageService.createImages.mockResolvedValue([
        { path: "uploads/new.webp" },
      ] as ImageResult[])
      mockRepository.update.mockResolvedValue(mockProject)

      await service.updateWithImages(1, { title: "Updated" }, [mockFile])

      expect(mockImageService.createImages).toHaveBeenCalledWith([{ file: mockFile }])
      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          images: [{ imageUrl: "uploads/new.webp" }],
        })
      )
    })

    it("should delete old and upload new images in the same call", async () => {
      mockImageService.createImages.mockResolvedValue([
        { path: "uploads/new.webp" },
      ] as ImageResult[])
      mockRepository.update.mockResolvedValue(mockProject)

      await service.updateWithImages(
        1,
        { title: "Updated", deletedImagePaths: ["uploads/old.webp"] },
        [mockFile]
      )

      expect(mockImageService.deleteImages).toHaveBeenCalledWith(["uploads/old.webp"])
      expect(mockRepository.deleteImages).toHaveBeenCalledWith(["uploads/old.webp"])
      expect(mockImageService.createImages).toHaveBeenCalled()
      expect(mockRepository.update).toHaveBeenCalled()
    })

    it("should throw ZodError when deletedImagePaths contains path traversal", async () => {
      await expect(
        service.updateWithImages(1, { deletedImagePaths: ["../secret"] })
      ).rejects.toThrow(ZodError)

      expect(mockImageService.deleteImages).not.toHaveBeenCalled()
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })
})
