import express from "express";
import productRouter from "./routes/product.router.js";
import handlebars from "express-handlebars";
import path from "path";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/product.manager.js";
import { Server } from "socket.io";

const app = express();
const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(process.cwd(), "src", "public")));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);


const httpServer = app.listen(8080, () => console.log("server ok puerto 8080"));

const socketServer = new Server(httpServer);


socketServer.on("connection", async (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log('Usuario desconectado');
    })


    const products = await prodManager.getAll();
    socket.emit("arrayProducts", products);


    socket.on("newProduct", async (prod) => {
        await prodManager.create(prod);
        const updatedProducts = await prodManager.getAll();
        socketServer.emit("arrayProducts", updatedProducts);
    });


    socket.on("deleteProduct", async (id) => {
        await prodManager.delete(id);
        const updatedProducts = await prodManager.getAll();
        socketServer.emit("arrayProducts", updatedProducts);
    });
});