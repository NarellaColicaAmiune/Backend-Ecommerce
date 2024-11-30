export const errorHandler = (err, req, res, next) => {
    console.log(`Error: ${err.message}`);
    const status = 400;
    res.status(status).json({ message: err.message });
};