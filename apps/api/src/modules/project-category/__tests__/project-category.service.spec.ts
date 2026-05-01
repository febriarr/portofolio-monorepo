import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import { ProjectCategoryService } from "@/modules/project-category/project-category.service"
import type { ProjectCategoryRepository } from "@/modules/project-category/project-category.repository"
import { ZodError } from "zod"
import { ProjectCategories } from "@workspace/shared"

const mockRepository = {
  create: jest.fn<ProjectCategoryRepository["create"]>(),
  update: jest.fn<ProjectCategoryRepository["update"]>(),
  findById: jest.fn<ProjectCategoryRepository["findById"]>(),
  findAll: jest.fn<ProjectCategoryRepository["findAll"]>(),
  delete: jest.fn<ProjectCategoryRepository["delete"]>(),
}

jest.mock("@/modules/project-category/project-category.repository", () => ({
  ProjectCategoryRepository: jest.fn().mockImplementation(() => mockRepository),
}))

describe("ProjectCategoryService", () => {
  let service: ProjectCategoryService

  const mockCategory = { id: 1, name: "Web Development" } as unknown as ProjectCategories

  beforeEach(() => {
    jest.clearAllMocks()
    service = new ProjectCategoryService(mockRepository as unknown as ProjectCategoryRepository)
  })

  describe("create", () => {
    it("should create a category with valid payload", async () => {
      mockRepository.create.mockResolvedValue(mockCategory)

      const result = await service.create({ name: "Web Development" })

      expect(mockRepository.create).toHaveBeenCalledWith({ name: "Web Development" })
      expect(result).toEqual(mockCategory)
    })

    it("should throw ZodError when name is missing", async () => {
      await expect(service.create({} as any)).rejects.toThrow(ZodError)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it("should throw ZodError when name is not a string", async () => {
      await expect(service.create({ name: 123 } as any)).rejects.toThrow(ZodError)
    })
  })

  describe("update", () => {
    it("should update a category with valid payload", async () => {
      const updated = { ...mockCategory, name: "Mobile Development" }
      mockRepository.update.mockResolvedValue(updated)

      const result = await service.update(1, { name: "Mobile Development" })

      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: "Mobile Development" })
      expect(result).toEqual(updated)
    })

    it("should allow partial update with empty object", async () => {
      mockRepository.update.mockResolvedValue(mockCategory)

      const result = await service.update(1, {})

      expect(mockRepository.update).toHaveBeenCalledWith(1, {})
      expect(result).toEqual(mockCategory)
    })
  })

  describe("findById", () => {
    it("should return a category by id", async () => {
      mockRepository.findById.mockResolvedValue(mockCategory)

      const result = await service.findById(1)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockCategory)
    })

    it("should propagate error when repository throws", async () => {
      mockRepository.findById.mockRejectedValue(new Error("Not found"))

      await expect(service.findById(99)).rejects.toThrow("Not found")
    })
  })

  describe("findAll", () => {
    it("should return all categories", async () => {
      const categories = [mockCategory, { id: 2, name: "Mobile" }] as ProjectCategories[]
      mockRepository.findAll.mockResolvedValue(categories)

      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(categories)
    })

    it("should return empty array when no categories exist", async () => {
      mockRepository.findAll.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  describe("delete", () => {
    it("should delete a category by id", async () => {
      mockRepository.delete.mockResolvedValue(mockCategory)

      const result = await service.delete(1)

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockCategory)
    })
  })
})
