import { AuthService } from "@/modules/auth/auth.service"
import { asyncHandler } from "@/shared/helpers/async-handler"
import { successResponse } from "@/shared/helpers/success-response"
import { CookieHelper } from "@/shared/helpers/cookie.helper"
import { loginSchema } from "@workspace/validator"
import { AUTH_CONSTANT } from "@/shared/constants/auth.constant"
import { AuthenticationError } from "@/shared/errors/custom-error"
import { Request, Response } from "express"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const payload = loginSchema.parse(req.body)
    const tokens = await this.authService.login(payload)

    CookieHelper.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return successResponse({
      res,
      message: "Login successful",
    })
  })

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[AUTH_CONSTANT.REFRESH_TOKEN_COOKIE]
    if (!refreshToken) throw new AuthenticationError("No refresh token")

    const tokens = await this.authService.refresh(refreshToken)
    CookieHelper.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return successResponse({
      res,
      message: "Token refreshed",
    })
  })

  logout = asyncHandler(async (_req: Request, res: Response) => {
    CookieHelper.clearAuthCookies(res)

    return successResponse({
      res,
      message: "Logout successful",
    })
  })

  me = asyncHandler(async (req: Request, res: Response) => {
    return successResponse({
      res,
      data: req.user,
    })
  })
}
