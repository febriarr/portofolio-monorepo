export interface IBaseRepository<TEntity, TCreate, TUpdate, TId> {
  create(createPayload: TCreate): Promise<TEntity>
  update(id: TId, updatePayload: TUpdate): Promise<TEntity>
  findById(id: TId): Promise<TEntity>
  findAll(): Promise<TEntity[]>
  delete(id: TId): Promise<void>
}
