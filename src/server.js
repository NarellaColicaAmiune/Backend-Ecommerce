import app from "./app.js"
import { initMongoDB } from "./daos/db.connection.js"

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    initMongoDB()
      .then(() => console.log("Conectado a la base de datos de MongoDB"))
      .catch((error) => console.log(error))
    /* ProductModel.insertMany(productosDePrueba)
      .then(() => console.log("Productos de prueba insertados"))
      .catch((error) => console.log(error));*/
  })
