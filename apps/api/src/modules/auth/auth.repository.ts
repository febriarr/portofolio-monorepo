import { Database } from "@/config/db"
import { users } from "@/config/db/schema"
import { eq } from "drizzle-orm"
import { User } from "@workspace/shared"

export class AuthRepository {
  constructor(private readonly database: Database) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.database.query.users.findFirst({
      where: eq(users.username, username),
    })
  }

  async findById(id: number): Promise<User | undefined> {
    return this.database.query.users.findFirst({
      where: eq(users.id, id),
    })
  }
}
