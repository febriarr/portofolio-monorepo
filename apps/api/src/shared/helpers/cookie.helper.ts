import { Response } from "express"
import { AUTH_CONSTANT } from "@/shared/constants/auth.constant"
import { env } from "@/config/env"

const isProduction = process.env.NODE_ENV === "production"

export class CookieHelper {
  static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie(AUTH_CONSTANT.ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 menit
      domain: isProduction ? env.DOMAIN : undefined
    })

    res.cookie(AUTH_CONSTANT.REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      domain: isProduction ? env.DOMAIN : undefined
    })
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie(AUTH_CONSTANT.ACCESS_TOKEN_COOKIE)
    res.clearCookie(AUTH_CONSTANT.REFRESH_TOKEN_COOKIE)
  }
}
