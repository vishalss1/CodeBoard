import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if(!ACCESS_TOKEN_SECRET) throw new Error("Access token not initialized");
if(!REFRESH_TOKEN_SECRET) throw new Error("Refresh token not initialized");

export const signAccessToken = async (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = async (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = async (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = async (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};