"use client"

import { TypographyLarge, TypographySmall } from "@workspace/ui/components/typography"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table"
import { useTechCategories } from "@/hooks/use-tech-category"
import { Button } from "@workspace/ui/components/button"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import { formatDate } from "@/lib/utils"
import { useState } from "react"
import { TechCategory } from "@workspace/shared"
import {
  AlertDialogDeleteTechCategory,
  DialogCreateTechCategory,
  SheetEditTechCategory,
} from "@/app/dashboard/tech-categories/_components/dialog"

export default function DetailTechCategories() {
  const { data: categories, isLoading } = useTechCategories()
  const [deleted, setDeleted] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [select, setSelect] = useState<TechCategory | null>(null)

  const handleDelete = (category: TechCategory) => {
    setDeleted(true)
    setSelect(category)
  }

  const handleEdit = (category: TechCategory) => {
    setEdit(true)
    setSelect(category)
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <TypographyLarge>Tech Categories</TypographyLarge>
            <TypographySmall>Manage yout Tech Categories</TypographySmall>
          </div>
          <DialogCreateTechCategory />
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
                        onClick={() => handleEdit(category)}
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

      {deleted && select && (
        <AlertDialogDeleteTechCategory
          category={select}
          open={!!select}
          onOpenChange={(open) => {
            if (!open) {
              setSelect(null)
            }
          }}
        />
      )}

      {edit && select && (
        <SheetEditTechCategory
          category={select}
          open={!!select}
          onOpenChange={(open) => {
            if (!open) setSelect(null)
          }}
        />
      )}
    </>
  )
}
