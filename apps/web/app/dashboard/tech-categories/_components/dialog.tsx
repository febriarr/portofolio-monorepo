import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { PlusIcon } from "@phosphor-icons/react"
import { Field, FieldError, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@workspace/ui/components/sheet"
import { formatDate } from "@/lib/utils"
import {
  CreateTechCategory,
  createTechCategorySchema,
  UpdateTechCategory,
  updateTechCategorySchema,
} from "@workspace/validator"
import {
  useCreateTechCategory,
  useDeleteTechCategory,
  useUpdateTechCategory,
} from "@/hooks/use-tech-category"
import { TechCategory } from "@workspace/shared"

type DialogProps = {
  category: TechCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DialogCreateTechCategory() {
  const { mutate, isPending } = useCreateTechCategory()
  const [open, setOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTechCategory>({
    resolver: zodResolver(createTechCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CreateTechCategory) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false)
        reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon /> Add Project Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new project</DialogTitle>
        </DialogHeader>
        <form
          id="form-create-project-category"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel htmlFor={"name"}>Name</FieldLabel>
            <Input id={"name"} placeholder="front-end, back-end, or other" {...register("name")} />
            <FieldError errors={[errors.name]} />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="form-create-project-category" disabled={isPending}>
              {isPending ? "Creating..." : "Create Project Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AlertDialogDeleteTechCategory({ category, open, onOpenChange }: DialogProps) {
  const { mutate, isPending } = useDeleteTechCategory()

  const handleDelete = () => {
    mutate(category.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project Category</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Apakah anda yakin menghapus project category {category.name} dari daftar?
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

export function SheetEditTechCategory({ category, open, onOpenChange }: DialogProps) {
  const { mutate, isPending } = useUpdateTechCategory()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTechCategory>({
    resolver: zodResolver(updateTechCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name ?? "",
      })
    }
  }, [category, reset])

  const onSubmit = (data: UpdateTechCategory) => {
    if (!category) return

    mutate(
      { id: category.id, payload: data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Project Category</SheetTitle>
        </SheetHeader>

        <form id="form-update-project-category" onSubmit={handleSubmit(onSubmit)} className="px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel>Create</FieldLabel>
              <Input defaultValue={formatDate(category.createdAt)} disabled />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="form-update-project-category" disabled={isPending}>
            {isPending ? "updating..." : "Update"}
          </Button>

          <SheetClose asChild>
            <Button variant="destructive">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
