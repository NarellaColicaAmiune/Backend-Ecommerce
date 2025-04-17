import { Router } from "express"
import {
  registerController,
  loginController,
} from "../controllers/auth.controllers.js"
import passport from "passport"
import { getUserById } from "../services/auth.services.js"

const authRouter = Router()

authRouter.post("/register", registerController)

authRouter.post("/login", loginController)

authRouter.get('/current', passport.authenticate('jwt'), async (req, res) => {
  const user = await getUserById(req.user._id)
  res.json(user)
})

export default authRouter
