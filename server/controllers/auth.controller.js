import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../util/jwt.js";
import { findByEmail, createUser } from "../models/user.model.js";
import { upsertToken, deleteToken } from "../models/refresh.model.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../util/cookie.js";
import AppError from "../util/AppError.js";

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return next(new AppError("Email & Password Required", 400));
        }

        const found = await findByEmail(email);
        if(found) {
            return next(new AppError("Email already exists", 400));
        }

        const hashed = await bcrypt.hash(password, 10);

        await createUser(email, hashed);

        res.status(201).json({ message: "User created" });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return next(new AppError("Email & Password Required", 400));
        }

        const user = await findByEmail(email);
        if(!user) {
            return next(new AppError("User not found", 401));
        }

        const verifyPass = await bcrypt.compare(password, user.password);

        if(!verifyPass) {
            return next(new AppError("Incorrect password", 401));
        }

        const payload = {
            user_id: user.user_id,
            email: email
        };

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        await upsertToken(refreshToken, user.user_id);

        setRefreshTokenCookie(res, refreshToken, 7 * 60 * 60 * 1000);

        res.status(200).json({ accessToken });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(204);
        }

        await deleteToken(refreshToken);

        clearRefreshTokenCookie(res);

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};