"use client"

import { useState } from "react"
import { useTechStacks } from "@/hooks/use-tech-stacks"
import { TechStackDetails } from "@workspace/shared"

import { DialogCreateTechStack, SheetEditTechStack, AlertDialogDeleteTechStack } from "./dialog"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import {
  SquaresFourIcon,
  ListIcon,
  PencilSimpleIcon,
  TrashIcon,
  ImageIcon,
} from "@phosphor-icons/react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { TypographyMuted, TypographyP, TypographySmall } from "@workspace/ui/components/typography"

type ViewMode = "table" | "grid"

export default function TechStacksPage() {
  const { data, isLoading } = useTechStacks()

  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [edit, setEdit] = useState<TechStackDetails | null>(null)
  const [deleteItem, setDeleteItem] = useState<TechStackDetails | null>(null)

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Tech Stacks</h1>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${data?.length ?? 0} items`}
            </p>
          </div>

          <div className="flex gap-2">
            {/* VIEW TOGGLE */}
            <div className="flex rounded-md border">
              <Button
                size="icon"
                variant="ghost"
                className={viewMode === "table" ? "bg-muted" : ""}
                onClick={() => setViewMode("table")}
              >
                <ListIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
              >
                <SquaresFourIcon className="size-4" />
              </Button>
            </div>

            {/* CREATE */}
            <DialogCreateTechStack />
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <Skeleton viewMode={viewMode} />
        ) : data?.length === 0 ? (
          <EmptyState />
        ) : viewMode === "table" ? (
          <TableView
            data={data ?? []}
            onEdit={(item) => setEdit(item)}
            onDelete={(item) => setDeleteItem(item)}
          />
        ) : (
          <GridView
            data={data ?? []}
            onEdit={(item) => setEdit(item)}
            onDelete={(item) => setDeleteItem(item)}
          />
        )}
      </div>

      {edit && (
        <SheetEditTechStack
          tech={edit}
          open={!!edit}
          onOpenChange={(open: boolean) => !open && setEdit(null)}
        />
      )}

      {deleteItem && (
        <AlertDialogDeleteTechStack
          tech={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open: boolean) => !open && setDeleteItem(null)}
        />
      )}
    </>
  )
}

function TableView({
  data,
  onEdit,
  onDelete,
}: {
  data: TechStackDetails[]
  onEdit: (item: TechStackDetails) => void
  onDelete: (item: TechStackDetails) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Create</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="relative size-10 shrink-0 overflow-hidden rounded-xs bg-muted">
                  {item.logo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_LINK_R2}/${item.logo}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-4 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>{item.name}</TableCell>

              <TableCell className="capitalize">
                {item.category ? <Badge>{item.category.name}</Badge> : "-"}
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>

              <TableCell className="flex gap-2">
                <Button size="icon" onClick={() => onEdit(item)}>
                  <PencilSimpleIcon />
                </Button>

                <Button size="icon" variant="destructive" onClick={() => onDelete(item)}>
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function GridView({
  data,
  onEdit,
  onDelete,
}: {
  data: TechStackDetails[]
  onEdit: (item: TechStackDetails) => void
  onDelete: (item: TechStackDetails) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {data.map((item) => (
        <div key={item.id} className="group space-y-2 rounded-xs border p-4">
          <div className="space-y-2">
            <div className="relative aspect-square w-full bg-muted">
              {item.logo ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_LINK_R2}/${item.logo}`}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground/40">
                  <ImageIcon className="size-8" />
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <TypographyP className="capitalize">{item.name}</TypographyP>
            <TypographyMuted>{formatDate(item.createdAt)}</TypographyMuted>
            <Badge className="capitalize">{item.category?.name}</Badge>
          </div>

          <div className="flex gap-2">
            <Button size="icon" onClick={() => onEdit(item)}>
              <PencilSimpleIcon />
            </Button>

            <Button size="icon" variant="destructive" onClick={() => onDelete(item)}>
              <TrashIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Skeleton({ viewMode }: { viewMode: "table" | "grid" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="animate-pulse rounded border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 border-b bg-muted" />
      ))}
    </div>
  )
}

function EmptyState() {
  return <div className="py-16 text-center text-muted-foreground">No tech stacks yet</div>
}
