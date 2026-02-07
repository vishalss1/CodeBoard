import AppError from "../util/AppError.js";
import { verifyAccessToken } from "../util/jwt.js";

export default (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Access token required", 401));
        }

        const accessToken = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(accessToken);

        req.user = decoded;

        next();
    } catch(err) {
        next(new AppError("Invalid AccessToken", 401));
    }
};