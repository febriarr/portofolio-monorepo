import * as dotenv from "dotenv"
import path from "path"

export default async function setup() {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  })
}
