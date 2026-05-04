"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@workspace/ui/components/sheet"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@workspace/ui/components/alert-dialog"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"

import { PlusIcon } from "@phosphor-icons/react"

import { formatDate } from "@/lib/utils"

import {
  CreateTechStack,
  createTechStackSchema,
  UpdateTechStack,
  updateTechStackSchema,
} from "@workspace/validator"

import { useCreateTechStack, useUpdateTechStack, useDeleteTechStack } from "@/hooks/use-tech-stacks"

import { useTechCategories } from "@/hooks/use-tech-category"

import { TechStack } from "@workspace/shared"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"

type DialogProps = {
  tech: TechStack
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DialogCreateTechStack() {
  const { mutate, isPending } = useCreateTechStack()
  const { data: categories } = useTechCategories()

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateTechStack>({
    resolver: zodResolver(createTechStackSchema),
    defaultValues: {
      name: "",
      techCategoryId: "",
    },
  })

  const onSubmit = (data: CreateTechStack) => {
    const formData = new FormData()

    formData.append("name", data.name)

    if (data.techCategoryId) {
      formData.append("techCategoryId", data.techCategoryId)
    }

    if (file) {
      formData.append("image", file)
    }

    mutate(formData, {
      onSuccess: () => {
        setOpen(false)
        reset()
        setPreview(null)
        setFile(null)
      },
    })
  }

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon /> Add Tech Stack
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tech Stack</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* NAME */}
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            {/* CATEGORY */}
            <Field>
              <FieldLabel>Category</FieldLabel>

              <Select
                value={watch("techCategoryId") || ""}
                onValueChange={(value) => {
                  setValue("techCategoryId", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* PREVIEW */}
            {preview && <img src={preview} className="h-16 w-16 object-contain" />}

            {/* FILE */}
            <Field>
              <FieldLabel>Logo</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0])
                  }
                }}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SheetEditTechStack({ tech, open, onOpenChange }: DialogProps) {
  const { mutate, isPending } = useUpdateTechStack()
  const { data: categories } = useTechCategories()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateTechStack>({
    resolver: zodResolver(updateTechStackSchema),
    defaultValues: {
      name: "",
      techCategoryId: "",
    },
  })

  useEffect(() => {
    if (tech) {
      reset({
        name: tech.name,
        techCategoryId: tech.techCategoryId ? String(tech.techCategoryId) : "",
      })
      setPreview(`${process.env.NEXT_PUBLIC_LINK_R2}/${tech.logo}`)
    }
  }, [tech, reset])

  const onSubmit = (data: UpdateTechStack) => {
    const formData = new FormData()

    if (data.name) formData.append("name", data.name)

    if (data.techCategoryId) {
      formData.append("techCategoryId", data.techCategoryId)
    }

    if (file) {
      formData.append("image", file)
    }

    mutate(
      { id: tech.id, payload: formData },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Tech Stack</SheetTitle>
        </SheetHeader>

        <form id="form-update-tech-stack" onSubmit={handleSubmit(onSubmit)} className="px-4">
          <FieldGroup>
            {/* NAME */}
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            {/* CATEGORY */}
            <Field>
              <FieldLabel>Category</FieldLabel>

              <Select
                value={watch("techCategoryId") || ""}
                onValueChange={(value) => {
                  setValue("techCategoryId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* PREVIEW */}
            {preview && <img src={preview} className="h-16 w-16 object-contain" />}

            {/* FILE */}
            <Field>
              <FieldLabel>Logo</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0])
                  }
                }}
              />
            </Field>

            {/* CREATED */}
            <Field>
              <FieldLabel>Created</FieldLabel>
              <Input defaultValue={tech.createdAt ? formatDate(tech.createdAt) : "-"} disabled />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="form-update-tech-stack" disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>

          <SheetClose asChild>
            <Button variant="destructive">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AlertDialogDeleteTechStack({ tech, open, onOpenChange }: DialogProps) {
  const { mutate, isPending } = useDeleteTechStack()

  const handleDelete = () => {
    mutate(tech.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tech Stack</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          Are you sure delete <b>{tech.name}</b> ?
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>

          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
