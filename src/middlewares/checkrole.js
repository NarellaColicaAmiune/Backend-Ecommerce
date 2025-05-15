import { getUserById } from "../services/auth.services.js"

const checkRole = (roles) => {
    return async (req, res, next) =>{
        const user = await getUserById(req.user._id)
        if (!roles.includes(user.role)) {
            return res.status(403).json({error: "No tienes permisos para acceder a esta ruta"})
        }
        req.user.cart = user.cart 
        req.user.email = user.email
        next()
    }
}

export default checkRole;