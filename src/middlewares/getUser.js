import UserModel from "../daos/models/user.model.js"
import jwt from "jsonwebtoken"
export const getUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1]

    const decoded = jwt.verify(token, "claveSecreta")

    const user = await UserModel.findOne({ _id: decoded._id })

    if (!user) {
      throw new Error("User not found")
    }

    req.user = user

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "No esta autorizado" })
  }
}
