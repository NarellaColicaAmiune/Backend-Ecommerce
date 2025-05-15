import { Router } from "express"
import {
  registerController,
  loginController,
  getUserController
} from "../controllers/auth.controllers.js"
import passport from "passport"
import { getUserById } from "../services/auth.services.js"
import { get } from "mongoose"

const authRouter = Router()

authRouter.post("/register", registerController)

authRouter.post("/login", loginController)

authRouter.get('/current', passport.authenticate('jwt'), getUserController)

export default authRouter
