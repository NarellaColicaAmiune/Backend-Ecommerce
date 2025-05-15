import { registerService, loginService } from "../services/auth.services.js"

export const registerController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password } = req.body
    const user = await registerService({first_name, last_name, email, age, password})
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const token = await loginService(email, password)
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }).json({ message: "Login successful", token })
  } catch (error) {
    next(error)
  }
}

export const getUserController = async (req, res) => {
  const user = await getUserById(req.user._id)
  res.json(user)
};