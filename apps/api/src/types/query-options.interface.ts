export interface FindAllOptions<TFilter = unknown, TSort = unknown> {
  page?: number

  limit?: number

  search?: string

  filter?: TFilter

  sort?: TSort
}
