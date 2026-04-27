export interface IBaseService<
  TEntity,
  TCreate,
  TUpdate,
  TId,
  TFilter = undefined,
  TFindAllResult = TEntity[],
> {
  create(createPayload: TCreate): Promise<TEntity>
  update(id: TId, updatePayload: TUpdate): Promise<TEntity>
  findById(id: TId): Promise<TEntity>
  findAll(filter?: TFilter): Promise<TFindAllResult>
  delete(id: TId): Promise<void>
}
