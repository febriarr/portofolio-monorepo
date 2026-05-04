"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProjectSchema, CreateProject } from "@workspace/validator"
import { useCreateProject } from "@/hooks/use-projects"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Field, FieldLabel, FieldError, FieldGroup } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { PlusIcon, XIcon, ImageIcon } from "@phosphor-icons/react"
import Image from "next/image"

const MAX_IMAGES = 10

interface DialogCreateProjectProps {
  categoryOptions?: { id: number; name: string | null }[]
  techStackOptions?: { id: number; name: string }[]
}

export function DialogCreateProject({
  categoryOptions = [],
  techStackOptions = [],
}: DialogCreateProjectProps) {
  const [open, setOpen] = useState(false)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: createProject, isPending } = useCreateProject()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProject>({
    resolver: zodResolver(createProjectSchema) as any,
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      liveUrl: "",
      linkRepo: "",
      categoryId: undefined,
      techStackIds: [],
    },
  })

  useEffect(() => {
    if (!open) {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
      setPreviews([])
      reset()
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES - previews.length
    const accepted = files.slice(0, remaining)
    const newPreviews = accepted.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]!.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const onSubmit = (values: CreateProject) => {
    const images = previews.map((p) => p.file)
    createProject({ payload: values, images }, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon />
          Add Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <form id="form-create-project" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="py-2">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title">
                Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="title" placeholder="My Awesome Project" {...register("title")} />
              <FieldError errors={[errors.title]} />
            </Field>

            {/* Short Description */}
            <Field>
              <FieldLabel htmlFor="shortDescription">Short Description</FieldLabel>
              <Input
                id="shortDescription"
                placeholder="Brief summary of the project"
                {...register("shortDescription")}
              />
              <FieldError errors={[errors.shortDescription]} />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Full description..."
                rows={4}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            {/* Live URL & Repo URL */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="liveUrl">Live URL</FieldLabel>
                <Input id="liveUrl" placeholder="https://example.com" {...register("liveUrl")} />
                <FieldError errors={[errors.liveUrl]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="linkRepo">Repository URL</FieldLabel>
                <Input
                  id="linkRepo"
                  placeholder="https://github.com/..."
                  {...register("linkRepo")}
                />
                <FieldError errors={[errors.linkRepo]} />
              </Field>
            </div>

            {/* Category */}
            <Field>
              <FieldLabel htmlFor="categoryId">Category</FieldLabel>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <select
                    id="categoryId"
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
                  ({previews.length}/{MAX_IMAGES})
                </span>
              </FieldLabel>

              {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-md border"
                    >
                      <Image src={p.url} alt={`Preview ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition-colors hover:bg-black/80"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previews.length < MAX_IMAGES && (
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
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-input py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <ImageIcon className="size-4" />
                    Click to upload images
                  </button>
                </>
              )}
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="form-create-project" disabled={isPending}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
