"use client"

import { useProjectCategories } from "@/hooks/use-project-category"
import { TypographyLarge, TypographySmall } from "@workspace/ui/components/typography"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import {
  AlertDialogDeleteProjectCategory,
  DialogCreateProjectCategory,
  SheetEditProjectCategory,
} from "@/app/dashboard/project-categories/_components/dialog"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { ProjectCategories } from "@workspace/shared"

export default function DetailProjectCategory() {
  const { data: categories, isLoading } = useProjectCategories()
  const [deleted, setDeleted] = useState<boolean>(false)
  const [selected, setSelected] = useState<ProjectCategories | null>(null)
  const [update, setUpdate] = useState<boolean>(false)

  const handleDelete = (category: ProjectCategories) => {
    setDeleted(true)
    setSelected(category)
  }

  const handleUpdate = (category: ProjectCategories) => {
    setUpdate(true)
    setSelected(category)
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <TypographyLarge>Project Categories</TypographyLarge>
            <TypographySmall>Manage yout Project Categories</TypographySmall>
          </div>
          <DialogCreateProjectCategory />
        </div>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>no</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Create</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories.length === 0 ? (
                <TableRow>
                  <TableCell className="col-span-4 text-center">No Data</TableCell>
                </TableRow>
              ) : (
                categories?.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="capitalize">{category.name}</TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className={"space-x-2"}>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleUpdate(category)}
                      >
                        <PencilSimpleIcon />
                      </Button>
                      <Button
                        variant={"destructive"}
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleDelete(category)}
                      >
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {deleted && selected && (
        <AlertDialogDeleteProjectCategory
          category={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
        />
      )}

      {update && selected && (
        <SheetEditProjectCategory
          category={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
        />
      )}
    </>
  )
}
