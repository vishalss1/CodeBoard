import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { signAccessToken, verifyRefreshToken } from "../util/jwt.js";
import { upsertToken, deleteToken } from "../models/refresh.model.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../util/cookie.js";
import AppError from "../util/AppError.js";

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if(!refreshToken) {
            return next(new AppError("Refresh token required", 401));
        }

        const decoded = await verifyRefreshToken(refreshToken);

        const payload = {
            user_id: decoded.user_id,
            email: decoded.email
        };

        const now = Math.floor(Date.now()/1000);
        const remaining = decoded.exp - now;

        if (remaining <= 0) {
            await deleteToken(refreshToken);
            clearRefreshTokenCookie(res);
            return next(new AppError("Refresh token expired", 401));
        }

        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
        if(!REFRESH_TOKEN_SECRET) throw new Error("Refresh Token Secret not set");

        const newAccessToken = await signAccessToken(payload);
        const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: remaining });

        await upsertToken(newRefreshToken, payload.user_id);

        setRefreshTokenCookie(res, newRefreshToken, remaining * 1000);

        res.status(200).json({ newAccessToken });
    } catch(err) {
        next(err);
    }
};