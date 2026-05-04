import { BaseRepository } from "@/shared/base/base.repository"
import { TechStack, TechStackDetails } from "@workspace/shared"
import { CreateTechStack, UpdateTechStack } from "@workspace/validator"
import { Database } from "@/config/db"
import { techStack } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { NotFoundError } from "@/shared/errors/custom-error"
import { ITechStacksRepository } from "@/modules/tech-stacks/tech-stacks.interface"

export class TechStacksRepository
  extends BaseRepository<TechStack, CreateTechStack, UpdateTechStack, typeof techStack>
  implements ITechStacksRepository
{
  constructor(database: Database) {
    super(database, techStack)
  }

  async findById(id: number): Promise<TechStackDetails> {
    const data = await this.database.query.techStack.findFirst({
      where: eq(techStack.id, id),
      with: {
        category: true,
      },
    })

    if (!data) {
      throw new NotFoundError("Tech stack not found with id " + id)
    }

    return data
  }

  findAll(): Promise<TechStackDetails[]> {
    return this.database.query.techStack.findMany({
      with: {
        category: true,
      },
    })
  }
}
