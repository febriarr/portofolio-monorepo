import { useCreateProjectCategory } from "@/hooks/use-project-category"
import { useForm } from "react-hook-form"
import { CreateProjectCategory, createProjectCategorySchema } from "@workspace/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
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
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export function DialogCreateProjectCategory() {
  const { mutate, isPending } = useCreateProjectCategory()
  const [open, setOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectCategory>({
    resolver: zodResolver(createProjectCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CreateProjectCategory) => {
    mutate(data, { onSuccess: () => setOpen(false) })
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
