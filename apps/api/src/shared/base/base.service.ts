import { IBaseService } from "@workspace/shared"
import { BaseRepository } from "@/shared/base/base.repository"
import { PgTable } from "drizzle-orm/pg-core"
import { TableConfig } from "drizzle-orm"

export abstract class BaseService<
  TEntity,
  TCreate,
  TUpdate,
  TTable extends PgTable<TableConfig>,
  TId = number,
  TFilter = undefined,
  TFindAll = unknown,
> implements IBaseService<TEntity, TCreate, TUpdate, TId, TFilter> {
  constructor(
    protected readonly repository: BaseRepository<TEntity, TCreate, TUpdate, TTable, TId, TFilter>
  ) {}

  async create(payload: TCreate): Promise<TEntity> {
    return this.repository.create(payload)
  }

  async update(id: TId, payload: TUpdate): Promise<TEntity> {
    return this.repository.update(id, payload)
  }

  async delete(id: TId): Promise<TEntity> {
    return this.repository.delete(id)
  }

  async findById(id: TId): Promise<TEntity> {
    return this.repository.findById(id)
  }

  abstract findAll(filter?: TFilter): Promise<TFindAll>
}
