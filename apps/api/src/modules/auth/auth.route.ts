import { Router } from "express"
import { authController } from "@/modules/auth/auth.module"
import { authenticate } from "@/middlewares/authenticate.middleware"

const authRouter: Router = Router()

authRouter.post("/login", authController.login)
authRouter.post("/refresh", authController.refresh)
authRouter.post("/logout", authenticate, authController.logout)
authRouter.get("/me", authenticate, authController.me)

export { authRouter }
