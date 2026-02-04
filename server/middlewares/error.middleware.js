export default (err, req, res, next) => {
    console.log("Error: ", err);
    const status = err.statusCode || 500;

    res.status(status).json({ message: "Internal Server Error" });
};