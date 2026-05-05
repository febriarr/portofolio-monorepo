import { AuthRepository } from "@/modules/auth/auth.repository"
import { db } from "@/config/db"
import { AuthService } from "@/modules/auth/auth.service"
import { AuthController } from "@/modules/auth/auth.controller"

const authRepository = new AuthRepository(db)

const authService = new AuthService(authRepository)

const authController = new AuthController(authService)

export { authController }
