export interface IBaseRepository<TEntity, TCreate, TUpdate, TId, TFilter = undefined> {
  create(createPayload: TCreate): Promise<TEntity>
  update(id: TId, updatePayload: TUpdate): Promise<TEntity>
  findById(id: TId): Promise<TEntity>
  findAll(filter?: TFilter): Promise<unknown>
  delete(id: TId): Promise<TEntity>
}
