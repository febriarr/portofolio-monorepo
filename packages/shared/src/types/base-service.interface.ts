export interface IBaseService<TEntity, TCreate, TUpdate, TId> {
  create(createPayload: TCreate): Promise<TEntity>
  update(updatePayload: TUpdate, id: TId): Promise<TEntity>
  findById(id: TId): Promise<TEntity>
  findAll(): Promise<TEntity[]>
  delete(id: TId): void
}
