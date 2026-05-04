"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProjectSchema, UpdateProject } from "@workspace/validator"
import { ProjectWithMeta } from "@workspace/shared"
import { useUpdateProject } from "@/hooks/use-projects"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { Field, FieldLabel, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { XIcon, ImageIcon } from "@phosphor-icons/react"
import Image from "next/image"

const MAX_IMAGES = 10

interface SheetEditProjectProps {
  project: ProjectWithMeta | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryOptions?: { id: number; name: string | null }[]
  techStackOptions?: { id: number; name: string }[]
}

export function SheetEditProject({
  project,
  open,
  onOpenChange,
  categoryOptions = [],
  techStackOptions = [],
}: SheetEditProjectProps) {
  const [newPreviews, setNewPreviews] = useState<{ file: File; url: string }[]>([])
  const [deletedImagePaths, setDeletedImagePaths] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateProject, isPending } = useUpdateProject()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProject>({
    resolver: zodResolver(updateProjectSchema) as any,
  })

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        shortDescription: project.shortDescription ?? "",
        description: project.description ?? "",
        liveUrl: project.liveUrl ?? "",
        linkRepo: project.linkRepo ?? "",
        categoryId: project.categoryId ?? undefined,
        techStackIds: project.techStacks.map((ts) => ts.techStack.id),
        deletedImagePaths: [],
      })
      setNewPreviews([])
      setDeletedImagePaths([])
    }
  }, [project])

  useEffect(() => {
    if (!open) {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url))
      setNewPreviews([])
      setDeletedImagePaths([])
    }
  }, [open])

  const existingImages =
    project?.images.filter((img) => img.imageUrl && !deletedImagePaths.includes(img.imageUrl)) ?? []

  const totalImages = existingImages.length + newPreviews.length

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES - totalImages
    const accepted = files.slice(0, remaining)
    const newItems = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setNewPreviews((prev) => [...prev, ...newItems])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeNewImage = (index: number) => {
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[index]!.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const removeExistingImage = (imageUrl: string) => {
    setDeletedImagePaths((prev) => [...prev, imageUrl])
  }

  const onSubmit = (values: UpdateProject) => {
    if (!project) return
    const payload: UpdateProject = {
      ...values,
      deletedImagePaths: deletedImagePaths.length ? deletedImagePaths : undefined,
    }
    const images = newPreviews.map((p) => p.file)
    updateProject({ id: project.id, payload, images }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
        </SheetHeader>

        <form id="form-edit-project" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-4">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="edit-title">Title</FieldLabel>
              <Input id="edit-title" {...register("title")} />
              <FieldError errors={[errors.title]} />
            </Field>

            {/* Short Description */}
            <Field>
              <FieldLabel htmlFor="edit-shortDescription">Short Description</FieldLabel>
              <Input id="edit-shortDescription" {...register("shortDescription")} />
              <FieldError errors={[errors.shortDescription]} />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="edit-description">Description</FieldLabel>
              <Textarea id="edit-description" rows={4} {...register("description")} />
              <FieldError errors={[errors.description]} />
            </Field>

            {/* Live URL & Repo URL */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="edit-liveUrl">Live URL</FieldLabel>
                <Input id="edit-liveUrl" {...register("liveUrl")} />
                <FieldError errors={[errors.liveUrl]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-linkRepo">Repository URL</FieldLabel>
                <Input id="edit-linkRepo" {...register("linkRepo")} />
                <FieldError errors={[errors.linkRepo]} />
              </Field>
            </div>

            {/* Category */}
            <Field>
              <FieldLabel htmlFor="edit-categoryId">Category</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <select
                    id="edit-categoryId"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              <FieldError errors={[errors.categoryId]} />
            </Field>

            {/* Tech Stacks */}
            <Field>
              <FieldLabel>Tech Stacks</FieldLabel>
              <Controller
                control={control}
                name="techStackIds"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {techStackOptions.map((ts) => {
                      const selected = (field.value ?? []).includes(ts.id)
                      return (
                        <button
                          key={ts.id}
                          type="button"
                          onClick={() => {
                            const current = field.value ?? []
                            field.onChange(
                              selected ? current.filter((id) => id !== ts.id) : [...current, ts.id]
                            )
                          }}
                          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input hover:bg-accent"
                          }`}
                        >
                          {ts.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              <FieldError errors={[errors.techStackIds]} />
            </Field>

            {/* Images */}
            <Field>
              <FieldLabel>
                Images{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  ({totalImages}/{MAX_IMAGES})
                </span>
              </FieldLabel>

              {(existingImages.length > 0 || newPreviews.length > 0) && (
                <div className="grid grid-cols-5 gap-2">
                  {/* Existing images dari DB */}
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square overflow-hidden rounded-md border"
                    >
                      <Image
                        src={img.imageUrl!}
                        alt="Project image"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.imageUrl!)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-destructive"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}

                  {/* New image previews */}
                  {newPreviews.map((p, i) => (
                    <div
                      key={`new-${i}`}
                      className="relative aspect-square overflow-hidden rounded-md border border-dashed border-primary"
                    >
                      <Image src={p.url} alt={`New image ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-destructive"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {totalImages < MAX_IMAGES && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-input py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <ImageIcon className="size-4" />
                    Add more images
                  </button>
                </>
              )}
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="form-edit-project" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
