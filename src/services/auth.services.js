import UserModel from "../daos/models/user.model.js"
import CartModel from "../daos/models/cart.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import UserDao from "../daos/user.dao.js"
import createUserSchema from "../schemas/user.validator.js"
import { sendMail } from "../services/email.services.js"

const userDao = new UserDao(UserModel)

export const registerService = async ({first_name, last_name, email, age, password}) => {
  try {
    // Validar los datos
    const result = createUserSchema.safeParse({first_name, last_name, email, age:Number(age), password})
    if (!result.success) {
      throw new Error(result.error.message)
    }

    // Chequear si el usuario existe
    const user = await UserModel.findOne({ email })

    if (user) {
      throw new Error("User already exists")
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el carrito
    const cart = await CartModel.create({ products: [] })

    // Crear el usuario
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: cart._id,
    })

    // Guardar el usuario
    const savedUser = await newUser.save()

    const userWithoutPassword = savedUser.toObject()

    delete userWithoutPassword.password
    await sendMail (userWithoutPassword.email, "Bienvenido/a nuestro ecommerce", `Bienvenido/a ${userWithoutPassword.first_name} ${userWithoutPassword.last_name} a nuestro ecommerce, ahora puedes comprar tus productos favoritos!`)
    return userWithoutPassword
  } catch (error) { console.log(error)
    throw new Error("Error registering user")
  }
}

export const loginService = async (email, password) => {
  try {
    // validar los datos
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Chequear si el usuario existe
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new Error("User not found")
    }

    // Chequear si la contraseña es correcta
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new Error("Invalid password")
    }

    // Generar el token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "coderSecret"
    )

    // Devolver el token
    return token
  } catch (error) {
    throw new Error("Error logging in user")
  }
}

export const getUserById = async (id) => {
  try {
    const user = await userDao.findById(id)
    return {
      ...user._doc, password: undefined
    }
  } catch (error) {
    console.log(error)
    throw new Error("Error getting user by id")
  }
}