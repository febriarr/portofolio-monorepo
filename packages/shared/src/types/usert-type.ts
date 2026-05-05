import { TimestampType } from "./timestamp-type"

export interface User extends TimestampType {
  id: number
  username: string
  password: string
}
