import express from "express";
import productRouter from "./routes/product.router.js";
import handlebars from "express-handlebars";
import path from "path";
import viewsRouter from "./routes/views.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { initMongoDB } from "./daos/db.connection.js";
import 'dotenv/config'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);

const PERSISTENCE = process.env.PERSISTENCE;

if (PERSISTENCE === "MONGO")
    initMongoDB()
    .then(() => console.log("Conectado a la base de datos de MongoDB"))
    .catch((error) => console.log(error));

const PORT = 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));