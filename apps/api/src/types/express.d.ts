import { JwtPayload } from "@workspace/shared"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
