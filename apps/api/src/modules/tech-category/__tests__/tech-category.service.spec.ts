import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import { TechCategoryService } from "@/modules/tech-category/tech-category.service"
import type { TechCategoryRepository } from "@/modules/tech-category/tech-category.repository"
import { ZodError } from "zod"
import { TechCategory } from "@workspace/shared"

const mockRepository = {
  create: jest.fn<TechCategoryRepository["create"]>(),
  update: jest.fn<TechCategoryRepository["update"]>(),
  findById: jest.fn<TechCategoryRepository["findById"]>(),
  findAll: jest.fn<TechCategoryRepository["findAll"]>(),
  delete: jest.fn<TechCategoryRepository["delete"]>(),
}

jest.mock("@/modules/tech-category/tech-category.repository", () => ({
  TechCategoryRepository: jest.fn().mockImplementation(() => mockRepository),
}))

describe("TechCategoryService", () => {
  let service: TechCategoryService

  const mockTechCategory = { id: 1, name: "Frontend" } as unknown as TechCategory

  beforeEach(() => {
    jest.clearAllMocks()
    service = new TechCategoryService(mockRepository as unknown as TechCategoryRepository)
  })

  describe("create", () => {
    it("should create a tech category with valid payload", async () => {
      mockRepository.create.mockResolvedValue(mockTechCategory)

      const result = await service.create({ name: "Frontend" })

      expect(mockRepository.create).toHaveBeenCalledWith({ name: "Frontend" })
      expect(result).toEqual(mockTechCategory)
    })

    it("should throw ZodError when name is missing", async () => {
      await expect(service.create({} as any)).rejects.toThrow(ZodError)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })

    it("should throw ZodError when name is not a string", async () => {
      await expect(service.create({ name: true } as any)).rejects.toThrow(ZodError)
    })
  })

  describe("update", () => {
    it("should update a tech category with valid payload", async () => {
      const updated = { id: 1, name: "Backend" }
      mockRepository.update.mockResolvedValue(updated as unknown as TechCategory)

      const result = await service.update(1, { name: "Backend" })

      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: "Backend" })
      expect(result).toEqual(updated)
    })

    it("should allow partial update with empty object", async () => {
      mockRepository.update.mockResolvedValue(mockTechCategory)

      const result = await service.update(1, {})

      expect(mockRepository.update).toHaveBeenCalledWith(1, {})
      expect(result).toEqual(mockTechCategory)
    })
  })

  describe("findById", () => {
    it("should return a tech category by id", async () => {
      mockRepository.findById.mockResolvedValue(mockTechCategory)

      const result = await service.findById(1)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTechCategory)
    })

    it("should propagate error when not found", async () => {
      mockRepository.findById.mockRejectedValue(new Error("Not found"))

      await expect(service.findById(99)).rejects.toThrow("Not found")
    })
  })

  describe("findAll", () => {
    it("should return all tech categories", async () => {
      const categories = [mockTechCategory, { id: 2, name: "Backend" }]
      mockRepository.findAll.mockResolvedValue(categories as unknown as TechCategory[])

      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(categories)
    })

    it("should return empty array when none exist", async () => {
      mockRepository.findAll.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  describe("delete", () => {
    it("should delete a tech category by id", async () => {
      mockRepository.delete.mockResolvedValue(mockTechCategory)

      const result = await service.delete(1)

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTechCategory)
    })
  })
})
