import { and, SQL } from "drizzle-orm"

export class QueryHelper {
  static pushIfExists(arr: SQL[], condition: SQL | undefined | null) {
    if (condition) {
      arr.push(condition)
    }
  }

  static combineConditions(conditions: SQL[]): SQL | undefined {
    if (conditions.length === 0) return undefined
    return and(...conditions)!
  }
}
