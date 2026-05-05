import { Request, Response, NextFunction } from "express"
import { JwtHelper } from "@/shared/helpers/jwt.helper"
import { CookieHelper } from "@/shared/helpers/cookie.helper"
import { AUTH_CONSTANT } from "@/shared/constants/auth.constant"
import { AuthenticationError } from "@/shared/errors/custom-error"

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const accessToken = req.cookies[AUTH_CONSTANT.ACCESS_TOKEN_COOKIE]
    if (!accessToken) throw new AuthenticationError("No access token")

    const payload = JwtHelper.verifyAccessToken(accessToken)
    req.user = { sub: payload.sub, username: payload.username }

    next()
  } catch {
    // Access token expired, coba refresh otomatis
    try {
      const refreshToken = req.cookies[AUTH_CONSTANT.REFRESH_TOKEN_COOKIE]
      if (!refreshToken) throw new AuthenticationError("No refresh token")

      const payload = JwtHelper.verifyRefreshToken(refreshToken)
      req.user = { sub: payload.sub, username: payload.username }

      // Issue new access token otomatis
      const newAccessToken = JwtHelper.generateAccessToken({
        sub: payload.sub,
        username: payload.username,
      })

      res.cookie(AUTH_CONSTANT.ACCESS_TOKEN_COOKIE, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 15 * 60 * 1000,
      })

      next()
    } catch {
      CookieHelper.clearAuthCookies(res)
      next(new AuthenticationError("Session expired, please login again"))
    }
  }
}
