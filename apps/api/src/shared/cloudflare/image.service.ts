import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { env } from "@/config/env"
import {
  CommonOptionsType,
  CreateImageInput,
  createImageSchema,
  ImageResult,
} from "@/shared/cloudflare/image-type"
import sharp from "sharp"
import { ConflictError } from "@/shared/errors/custom-error"
import { UploadedFile } from "@workspace/shared"

export class ImageService {
  private readonly bucketName: string
  private readonly r2Client: S3Client

  constructor() {
    this.bucketName = env.R2_BUCKET_NAME
    this.r2Client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    })
  }

  private normalizePath(prefix: string): string {
    let p = prefix.trim()
    if (p.startsWith("/")) p = p.slice(1)
    if (!p.endsWith("/")) p += "/"
    return p
  }

  private withDefaultOptions(opts?: CommonOptionsType): CommonOptionsType {
    return {
      bucket: opts?.bucket || this.bucketName,
      prefix: this.normalizePath(opts?.prefix || "uploads/"),
      allowedMimeTypes: opts?.allowedMimeTypes ?? [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ],
      maxBytes: opts?.maxBytes ?? 5_000_000,
    }
  }

  private generateUniqueFileName(ext: string): string {
    const ts = Date.now()
    const rand = Math.random().toString(36).substr(2, 8)
    return `${this.bucketName}_${rand}.${ext}`
  }

  private async processImage(file: UploadedFile): Promise<{
    buffer: Buffer
    mimeType: string
    ext: string
  }> {
    if (file.mimetype === "image/svg+xml") {
      return {
        buffer: file.buffer,
        mimeType: file.mimetype,
        ext: "svg",
      }
    }
    const buffer = await sharp(file.buffer).webp({ quality: 90 }).toBuffer()

    return {
      buffer,
      mimeType: "image/webp",
      ext: "webp",
    }
  }

  async createImage(input: CreateImageInput): Promise<ImageResult> {
    const parsed = createImageSchema.parse(input)
    const { file } = parsed
    const options = this.withDefaultOptions(parsed.options)

    if (!options.allowedMimeTypes?.includes(file.mimetype)) {
      throw new ConflictError("Unsupported file type")
    }

    if (options.maxBytes && file.size > options.maxBytes) {
      throw new ConflictError("File size too large")
    }

    const { buffer, mimeType, ext } = await this.processImage(file)

    const fileName = this.generateUniqueFileName(ext)
    const key = `${options.prefix}${fileName}`

    await this.r2Client.send(
      new PutObjectCommand({
        Bucket: options.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    )

    return {
      path: key,
      meta: {
        fileName,
        mimeType: mimeType,
        size: buffer.length,
      },
    }
  }

  async createImages(inputs: CreateImageInput[]): Promise<ImageResult[]> {
    if (!inputs.length) return []
    if (inputs.length > 10) {
      throw new ConflictError("Too many files. Max 10 allowed")
    }

    const created: ImageResult[] = []

    try {
      for (const input of inputs) {
        const img = await this.createImage(input)
        created.push(img)
      }
      return created
    } catch (err) {
      await this.deleteImages(created.map((i) => i.path))
      throw err
    }
  }

  async deleteImages(paths: string[], bucket?: string) {
    if (!paths.length) return

    const targetBucket = bucket || this.bucketName

    await Promise.all(
      paths.map((path) =>
        this.r2Client.send(
          new DeleteObjectCommand({
            Bucket: targetBucket,
            Key: path,
          })
        )
      )
    )
  }

  async updateImage(params: {
    newImage: CreateImageInput
    oldPath?: string
  }): Promise<ImageResult> {
    const { newImage, oldPath } = params

    let created: ImageResult | null = null

    try {
      created = await this.createImage(newImage)

      if (oldPath) {
        await this.deleteImages([oldPath])
      }

      return created
    } catch (err) {
      if (created) {
        await this.deleteImages([created.path])
      }
      throw err
    }
  }
}
