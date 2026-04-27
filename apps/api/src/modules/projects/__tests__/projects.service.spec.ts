import { jest } from "@jest/globals"
import { ProjectsService } from "../projects.service"
import { IProjectsRepository } from "../projects.interface"
import { ImageService } from "@/shared/cloudflare/image.service"

// Mock repository
const mockRepository: jest.Mocked<IProjectsRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdWithDetail: jest.fn(),
  delete: jest.fn(),
  deleteImages: jest.fn(),
}

// Mock image service
const mockImageService = {
  createImages: jest.fn(),
  deleteImages: jest.fn(),
} as unknown as jest.Mocked<ImageService>

describe("ProjectsService", () => {
  let service: ProjectsService

  beforeEach(() => {
    service = new ProjectsService(mockRepository, mockImageService)
    jest.clearAllMocks()
  })

  describe("findAll", () => {
    it("should return all projects", async () => {
      const mockProjects = [{ id: 1, title: "Project 1" }]
      mockRepository.findAll.mockResolvedValue(mockProjects as any)

      const result = await service.findAll()

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProjects)
    })
  })

  describe("findById", () => {
    it("should return project by id", async () => {
      const mockProject = { id: 1, title: "Project 1" }
      mockRepository.findById.mockResolvedValue(mockProject as any)

      const result = await service.findById(1)

      expect(mockRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockProject)
    })
  })

  describe("createWithImages", () => {
    it("should create project without images", async () => {
      const payload = { title: "New Project" }
      const mockProject = { id: 1, title: "New Project" }
      mockRepository.create.mockResolvedValue(mockProject as any)

      const result = await service.createWithImages(payload as any)

      expect(mockImageService.createImages).not.toHaveBeenCalled()
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProject)
    })

    it("should upload images then create project", async () => {
      const payload = { title: "New Project" }
      const mockFiles = [{ buffer: Buffer.from("img"), mimetype: "image/webp" }]
      const mockUploaded = [{ path: "uploads/img.webp", meta: {} }]
      const mockProject = { id: 1, title: "New Project" }

      mockImageService.createImages.mockResolvedValue(mockUploaded as any)
      mockRepository.create.mockResolvedValue(mockProject as any)

      const result = await service.createWithImages(payload as any, mockFiles as any)

      expect(mockImageService.createImages).toHaveBeenCalledTimes(1)
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          images: [{ imageUrl: "uploads/img.webp" }],
        })
      )
      expect(result).toEqual(mockProject)
    })
  })

  describe("updateWithImages", () => {
    it("should delete old images then upload new ones", async () => {
      const payload = {
        title: "Updated",
        deletedImagePaths: ["uploads/old.webp"],
      }
      const mockFiles = [{ buffer: Buffer.from("img"), mimetype: "image/webp" }]
      const mockUploaded = [{ path: "uploads/new.webp", meta: {} }]
      const mockProject = { id: 1, title: "Updated" }

      mockImageService.createImages.mockResolvedValue(mockUploaded as any)
      mockRepository.update.mockResolvedValue(mockProject as any)

      const result = await service.updateWithImages(1, payload as any, mockFiles as any)

      expect(mockImageService.deleteImages).toHaveBeenCalledWith(["uploads/old.webp"])
      expect(mockRepository.deleteImages).toHaveBeenCalledWith(["uploads/old.webp"])
      expect(mockImageService.createImages).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProject)
    })
  })

  describe("delete", () => {
    it("should delete project by id", async () => {
      mockRepository.delete.mockResolvedValue(undefined)

      await service.delete(1)

      expect(mockRepository.delete).toHaveBeenCalledWith(1)
    })
  })
})
