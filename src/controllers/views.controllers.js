export const homeController = async (req, res) => {
    const products = await ProductService.getAll()
  
    const productsParsed = {}
  
    productsParsed["products"] = products.docs.map((doc) => ({
      name: doc.name,
      price: doc.price,
      stock: doc.stock,
      category: doc.category,
      description: doc.description,
      _id: doc._id,
    }))
  
    productsParsed["totalPages"] = products.totalPages
    productsParsed["page"] = products.page
    productsParsed["hasPrevPage"] = products.hasPrevPage
    productsParsed["hasNextPage"] = products.hasNextPage
    productsParsed["prevPage"] = products.prevPage
    productsParsed["nextPage"] = products.nextPage
  
    res.render("home", { products: productsParsed })
  }

export const realTimeProductsController = async (req, res) => {
    const { docs } = await ProductService.getAll()
  
    const products = docs.map((doc) => ({
      name: doc.name,
      price: doc.price,
      stock: doc.stock,
      category: doc.category,
      description: doc.description,
      _id: doc._id,
    }))
  
    res.render("realTimeProducts", { products })}

export const cartController = async (req, res) => {
        res.render("cart")
}

export const registerController = async (req, res) => {
    res.render("register")
}

export const loginController = async (req, res) => {
    res.render("login")
}