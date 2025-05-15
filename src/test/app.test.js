import request from "supertest";
import app from "../app.js";
import { initMongoDB } from "../daos/db.connection.js";
import mongoose from "mongoose";

beforeAll(async () => {
    initMongoDB()
          .then(() => console.log("Conectado a la base de datos de MongoDB"))
          .catch((error) => console.log(error))
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("rutas de usuarios", () => {
    it("should return 404", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(404);
    });
});

describe("rutas de productos", () => {
    it("debe retornar un objeto", async () => {
        const response = await request(app).get("/api/products");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.payload).toBeInstanceOf(Array);
        // testear las propiedades del objeto
        expect(response.body.payload[0]).toHaveProperty("name"); 
    });

    it("debe crear un producto", async () => {
        const response = await request(app).post("/api/products").send({
            name: "Almendras",
            description: "Almendras de la mejor calidad",
            price: 18000,
            stock: 50,
            category: "Frutos secos",
            availability: true,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        // testear las propiedades del objeto
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("description");
    });

    it("debe eliminar un producto", async () => {
        const products = await request(app).get("/api/products");
        const id = products.body.payload[0]._id;
        const response = await request(app).delete("/api/products/" + id);
        expect(response.statusCode).toBe(200);
        // res.json({ message: "Product deleted" });
        expect(response.body.message).toBe("Product deleted");
    });
});
