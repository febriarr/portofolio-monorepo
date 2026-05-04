"use client"

import { useProjectCategories } from "@/hooks/use-project-category"
import { TypographyLead, TypographySmall } from "@workspace/ui/components/typography"
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
import { DialogCreateProjectCategory } from "@/app/dashboard/project-categories/_components/dialog"

export default function DetailProjectCategory() {
  const { data: categories, isLoading } = useProjectCategories()

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <TypographyLead>Project Categories</TypographyLead>
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
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell className={"space-x-2"}>
                    <Button variant="secondary" size="icon" className="cursor-pointer">
                      <PencilSimpleIcon />
                    </Button>
                    <Button variant={"destructive"} size="icon" className="cursor-pointer">
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
  )
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}
