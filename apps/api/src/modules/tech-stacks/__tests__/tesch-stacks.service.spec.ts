import { jest, describe, it, expect, beforeEach } from "@jest/globals"
import { TechStacksService } from "@/modules/tech-stacks/tech-stacks.service"
import type { TechStacksRepository } from "@/modules/tech-stacks/tech-stacks.repository"
import type { ImageService } from "@/shared/cloudflare/image.service"
import { NotFoundError } from "@/shared/errors/custom-error"
import { ZodError } from "zod"
import { TechStack } from "@workspace/shared"
import { ImageResult } from "@/shared/cloudflare/image-type"

const mockRepository = {
  create: jest.fn<TechStacksRepository["create"]>(),
  update: jest.fn<TechStacksRepository["update"]>(),
  findById: jest.fn<TechStacksRepository["findById"]>(),
  findAll: jest.fn<TechStacksRepository["findAll"]>(),
  delete: jest.fn<TechStacksRepository["delete"]>(),
} as unknown as jest.Mocked<TechStacksRepository>

const mockImageService = {
  createImage: jest.fn<ImageService["createImage"]>(),
  createImages: jest.fn<ImageService["createImages"]>(),
  deleteImages: jest.fn<ImageService["deleteImages"]>(),
}

jest.mock("@/modules/tech-stacks/tech-stacks.repository", () => ({
  TechStacksRepository: jest.fn().mockImplementation(() => mockRepository),
}))

jest.mock("@/shared/cloudflare/image.service", () => ({
  ImageService: jest.fn().mockImplementation(() => mockImageService),
}))

describe("TechStacksService", () => {
  let service: TechStacksService

  const mockTechStack = {
    id: 1,
    name: "React",
    techCategoryId: "1",
    logo: "https://cdn.example.com/react.webp" as string,
  } as unknown as TechStack

  const mockFile = {
    originalname: "react.png",
    mimetype: "image/png",
    buffer: Buffer.from("fake"),
    size: 1000,
  } as Express.Multer.File

  beforeEach(() => {
    jest.clearAllMocks()
    service = new TechStacksService(
      mockRepository as unknown as TechStacksRepository,
      mockImageService as unknown as ImageService
    )
  })

  describe("create", () => {
    it("should create a tech stack with valid payload", async () => {
      mockRepository.create.mockResolvedValue(mockTechStack)

      const result = await service.create({ name: "React" })

      expect(mockRepository.create).toHaveBeenCalledWith({ name: "React" })
      expect(result).toEqual(mockTechStack)
    })

    it("should create with all optional fields", async () => {
      const payload = { name: "Vue", techCategoryId: "2", logo: "https://cdn.example.com/vue.webp" }
      mockRepository.create.mockResolvedValue({ id: 2, ...payload } as unknown as TechStack)

      const result = await service.create(payload)

      expect(mockRepository.create).toHaveBeenCalledWith(payload)
      expect(result.name).toBe("Vue")
    })

    it("should throw ZodError when name is missing", async () => {
      await expect(service.create({} as any)).rejects.toThrow(ZodError)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })
  })

  describe("update", () => {
    it("should update a tech stack with valid payload", async () => {
      const updated = { ...mockTechStack, name: "React 19" }
      mockRepository.update.mockResolvedValue(updated)

      const result = await service.update(1, { name: "React 19" })

      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: "React 19" })
      expect(result).toEqual(updated)
    })

    it("should allow partial update with empty object", async () => {
      mockRepository.update.mockResolvedValue(mockTechStack)

      const result = await service.update(1, {})

      expect(mockRepository.update).toHaveBeenCalledWith(1, {})
      expect(result).toEqual(mockTechStack)
    })
  })

  describe("findById", () => {
    it("should return a tech stack by id", async () => {
      mockRepository.findById.mockResolvedValue(mockTechStack)

      const result = await service.findById(1)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTechStack)
    })

    it("should propagate error when not found", async () => {
      mockRepository.findById.mockRejectedValue(new Error("Not found"))

      await expect(service.findById(99)).rejects.toThrow("Not found")
    })
  })

  describe("findAll", () => {
    it("should return all tech stacks", async () => {
      const stacks = [mockTechStack, { id: 2, name: "Vue", techCategoryId: "1", logo: null }]
      mockRepository.findAll.mockResolvedValue(stacks as unknown as TechStack[])

      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(stacks)
    })
  })

  describe("delete", () => {
    it("should delete a tech stack by id", async () => {
      mockRepository.delete.mockResolvedValue(mockTechStack)

      const result = await service.delete(1)

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTechStack)
    })
  })

  describe("createWithImage", () => {
    it("should create without image when no file provided", async () => {
      mockRepository.create.mockResolvedValue(mockTechStack)

      const result = await service.createWithImage({ name: "React" })

      expect(mockImageService.createImage).not.toHaveBeenCalled()
      expect(mockRepository.create).toHaveBeenCalled()
      expect(result).toEqual(mockTechStack)
    })

    it("should upload image and set logo before creating", async () => {
      mockImageService.createImage.mockResolvedValue({
        path: "uploads/react.webp",
      } as unknown as ImageResult)
      mockRepository.create.mockResolvedValue({ ...mockTechStack, logo: "uploads/react.webp" })

      const result = await service.createWithImage({ name: "React" }, mockFile)

      expect(mockImageService.createImage).toHaveBeenCalledWith({ file: mockFile })
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ logo: "uploads/react.webp" })
      )
      expect(result.logo).toBe("uploads/react.webp")
    })

    it("should throw ZodError when payload is invalid", async () => {
      await expect(service.createWithImage({} as any)).rejects.toThrow(ZodError)
      expect(mockImageService.createImage).not.toHaveBeenCalled()
    })
  })

  describe("updateWithImage", () => {
    it("should update without touching image when no file provided", async () => {
      mockRepository.findById.mockResolvedValue(mockTechStack)
      mockRepository.update.mockResolvedValue(mockTechStack)

      const result = await service.updateWithImage(1, { name: "React 18" })

      expect(mockImageService.createImage).not.toHaveBeenCalled()
      expect(mockImageService.deleteImages).not.toHaveBeenCalled()
      expect(mockRepository.update).toHaveBeenCalled()
      expect(result).toEqual(mockTechStack)
    })

    it("should upload new image, delete old, then update", async () => {
      mockRepository.findById.mockResolvedValue(mockTechStack)
      mockImageService.createImage.mockResolvedValue({
        path: "uploads/react-new.webp",
      } as unknown as ImageResult)
      mockRepository.update.mockResolvedValue({
        ...mockTechStack,
        logo: "uploads/react-new.webp",
      })

      const result = await service.updateWithImage(1, { name: "React" }, mockFile)

      expect(mockImageService.createImage).toHaveBeenCalledWith({ file: mockFile })
      expect(mockImageService.deleteImages).toHaveBeenCalledWith([mockTechStack.logo!])
      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ logo: "uploads/react-new.webp" })
      )
      expect(result.logo).toBe("uploads/react-new.webp")
    })

    it("should throw NotFoundError when tech stack does not exist", async () => {
      mockRepository.findById.mockResolvedValue(null as unknown as TechStack)

      await expect(service.updateWithImage(99, { name: "React" })).rejects.toThrow(NotFoundError)
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })
})
