import jwt, { JwtPayload as JwtPayloadBase } from "jsonwebtoken"
import { JwtPayload } from "@workspace/shared"

export class JwtHelper {
  private static readonly accessSecret = process.env.JWT_ACCESS_SECRET!
  private static readonly refreshSecret = process.env.JWT_REFRESH_SECRET!

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: "15m" })
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" })
  }

  static verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.accessSecret) as JwtPayloadBase & JwtPayload
    return decoded
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayloadBase & JwtPayload
  }
}
