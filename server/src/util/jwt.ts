import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthJwtPayload extends jwt.JwtPayload {
    user_id: string;
    username: string;
    exp: number;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if(!ACCESS_TOKEN_SECRET) throw new Error("Access token not initialized");
if(!REFRESH_TOKEN_SECRET) throw new Error("Refresh token not initialized");

export const signAccessToken = async (payload: object) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = async (payload: object) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = async (token: string): Promise<AuthJwtPayload> => {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if(typeof decoded === "string") {
        throw new Error("Invalid refresh token payload");
    }

    return decoded as AuthJwtPayload;
};

export const verifyRefreshToken = async (token: string): Promise<AuthJwtPayload> => {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

    if(typeof decoded === "string") {
        throw new Error("Invalid refresh token payload");
    }

    return decoded as AuthJwtPayload;
};