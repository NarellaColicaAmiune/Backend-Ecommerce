import express from "express"
import productRouter from "./routes/product.router.js"
import authRouter from "./routes/auth.router.js"
import handlebars from "express-handlebars"
import path from "path"
import viewsRouter from "./routes/views.router.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { initMongoDB } from "./daos/db.connection.js"
import "dotenv/config"
import cartRouter from "./routes/cart.router.js"
import { ProductModel } from "./daos/models/product.model.js"
import cookieParser from "cookie-parser"
import { initializePassport } from "./passport/passport.js"
import passport from "passport"
import MongoStore from "connect-mongo"
import session from "express-session"
// import emailRouter from "./routes/email.router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/coderhouse",
    ttl: 180,
  }),
  secret: "1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 180000,
  },
};
app.use(session(sessionConfig));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(process.cwd(), "src/views"))

app.use("/", viewsRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/api/sessions", authRouter)
// app.use("/api", emailRouter)

app.use(errorHandler)

const PERSISTENCE = process.env.PERSISTENCE

const productosDePrueba = [
  {
    name: "Nueces",
    description: "Nueces de la mejor calidad",
    price: 11000,
    stock: 100,
    category: "Alimentos",
    availability: true,
  },
  {
    name: "Mermelada de moras",
    description: "Mermelada de moras de la mejor calidad",
    price: 3500,
    stock: 50,
    category: "Alimentos",
    availability: true,
  },
  {
    name: "Almendras",
    description: "Almendras de la mejor calidad",
    price: 18000,
    stock: 50,
    category: "Alimentos",
    availability: true,
  },
  {
    name: "Mermelada de durazno",
    description: "Mermelada de durazno de la mejor calidad",
    price: 3500,
    stock: 50,
    category: "Alimentos",
    availability: true,
  },
]

export default app;