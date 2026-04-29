import { IBaseRepository } from "@workspace/shared"
import { Database } from "@/config/db"
import { PgColumn, PgTable } from "drizzle-orm/pg-core"
import { eq, InferInsertModel, TableConfig } from "drizzle-orm"
import { NotFoundError } from "@/shared/errors/custom-error"

type TableWithId = {
  id: PgColumn
}

export abstract class BaseRepository<
  TEntity,
  TCreate,
  TUpdate,
  TTable extends PgTable<TableConfig> & TableWithId,
  TId = number,
  TFilter = undefined,
  TFindAll = unknown,
> implements IBaseRepository<TEntity, TCreate, TUpdate, TId, TFilter> {
  constructor(
    protected readonly database: Database,
    protected readonly table: TTable
  ) {}

  async create(payload: TCreate): Promise<TEntity> {
    const [result] = await this.database
      .insert(this.table)
      .values(payload as InferInsertModel<TTable>)
      .returning()

    if (!result) {
      throw new NotFoundError("Failed to create: insert returned no rows!")
    }

    return result as TEntity
  }

  async update(id: TId, payload: TUpdate): Promise<TEntity> {
    const [result] = (await this.database
      .update(this.table)
      .set(payload as InferInsertModel<TTable>)
      .where(eq(this.table.id, id))
      .returning()) as unknown as TEntity[]

    if (!result) {
      throw new NotFoundError("Failed to update: insert returned no rows!")
    }

    return result as TEntity
  }

  async delete(id: TId): Promise<TEntity> {
    const [result] = (await this.database
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning()) as unknown as TEntity[]

    if (!result) {
      throw new NotFoundError(`Failed to delete: id ${id} not found`)
    }

    return result as TEntity
  }

  abstract findById(id: TId): Promise<TEntity>

  abstract findAll(filter?: TFilter): Promise<TFindAll>
}
