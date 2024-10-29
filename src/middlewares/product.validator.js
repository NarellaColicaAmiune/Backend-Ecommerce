export const productValidator = (req, res, next) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Campos obligatorios faltantes" });
    }

    if (typeof title !== "string" || typeof description !== "string" || typeof code !== "string" || typeof category !== "string") {
        return res.status(400).json({ message: "Campos title, description, code, y category deben ser strings" });
    }
    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ message: "Campo price debe ser un número positivo" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ message: "Campo stock debe ser un número no negativo" });
    }
    if (status !== undefined && typeof status !== "boolean") {
        return res.status(400).json({ message: "Campo status debe ser booleano" });
    }
    if (thumbnails && !Array.isArray(thumbnails)) {
        return res.status(400).json({ message: "Campo thumbnails debe ser un array" });
    }

    next();
};
