import bcrypt from "bcrypt"
import { AuthRepository } from "@/modules/auth/auth.repository"
import { JwtHelper } from "@/shared/helpers/jwt.helper"
import { AuthTokens } from "@workspace/shared"
import { AuthenticationError } from "@/shared/errors/custom-error"
import { LoginPayload } from "@workspace/validator"

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { username, password } = payload

    const user = await this.authRepository.findByUsername(username)
    if (!user) throw new AuthenticationError("Invalid credentials")

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new AuthenticationError("Invalid credentials")

    const jwtPayload = { sub: user.id, username: user.username }

    return {
      accessToken: JwtHelper.generateAccessToken(jwtPayload),
      refreshToken: JwtHelper.generateRefreshToken(jwtPayload),
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = JwtHelper.verifyRefreshToken(refreshToken)

      const user = await this.authRepository.findById(payload.sub)
      if (!user) throw new AuthenticationError("User not found")

      const jwtPayload = { sub: user.id, username: user.username }

      return {
        accessToken: JwtHelper.generateAccessToken(jwtPayload),
        refreshToken: JwtHelper.generateRefreshToken(jwtPayload),
      }
    } catch {
      throw new AuthenticationError("Invalid or expired refresh token")
    }
  }
}
