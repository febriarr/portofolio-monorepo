"use client"

import { useState } from "react"
import Image from "next/image"
import { ProjectImages } from "@workspace/shared"

export function ProjectImageGallery({ images, title }: { images: ProjectImages[]; title: string }) {
  const [activeImage, setActiveImage] = useState(0)
  const current = images[activeImage] ?? images[0]

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xs border bg-muted">
        <Image
          src={`${process.env.NEXT_PUBLIC_LINK_R2}/${current!.imageUrl}`}
          alt={`${title} - image ${activeImage + 1}`}
          fill
          className="object-cover transition-all duration-300"
          priority
        />
        <div className="absolute right-3 bottom-3 rounded-xs bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {activeImage + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(i)}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xs border-2 transition-all ${
                activeImage === i
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_LINK_R2}/${img.imageUrl}`}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
