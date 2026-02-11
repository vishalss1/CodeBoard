import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { createGithubUser, findByEmail, findByGithubId, insertGIdOnEmail } from "../models/user.model.js";
import { upsertToken } from "../models/refresh.model.js";
import { exchangeCodeForToken, fetchGithubUser } from "../services/githubOAuth.service.js";
import { signAccessToken, signRefreshToken } from "../util/jwt.js";
import { setRefreshTokenCookie } from "../util/cookie.js";
import AppError from "../util/AppError.js";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;

// connection with github request
export const redirectToGithub = (req: Request, res: Response) => {
    const RANDOM_STRING = crypto.randomBytes(32).toString("hex"); // CSRF protection

    res.cookie("oauth_state", RANDOM_STRING, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 5 * 60 * 1000,
    });

    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user:email&state=${RANDOM_STRING}`;

    return res.redirect(githubAuthURL);
};

// JWT login
const jwtLogin = async (user: { user_id: string; username: string | null; }, res: Response, next: NextFunction) => {
    try{
        const payload = {
            user_id: user.user_id,
            username: user.username,
        };

        const accessToken = await signAccessToken(payload);
        const refreshToken = await signRefreshToken(payload);

        await upsertToken(refreshToken, user.user_id);

        setRefreshTokenCookie(res, refreshToken, 7 * 24 * 60 * 60 * 1000);

        res.status(200).json({ accessToken });
    } catch(err) {
        next(err);
    }
};

// send accessToken to fetch userdata
export const OAuthLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { state, code } = req.query;
        const storedState = req.cookies.oauth_state;

        if(typeof state !== 'string' || typeof code !== 'string') {
            return next(new AppError("Invalid OAuth response", 400));
        }

        if(state !== storedState) {
            return next(new AppError("Access denied", 401));
        }

        res.clearCookie("oauth_state");

        const githubAccessToken = await exchangeCodeForToken(code);
        const githubUser = await fetchGithubUser(githubAccessToken);

        const exists = await findByGithubId(githubUser.github_id);

        // user has registered with github
        if(exists !== null) {
            const user = exists;
            return jwtLogin(user, res, next);
        }

        // if user already has an account (local JWT)
        if(githubUser.email) {
            const emailExists = await findByEmail(githubUser.email);
            if(emailExists !== null) {
                const user = await insertGIdOnEmail(githubUser.email, githubUser.github_id);
                return jwtLogin(user, res, next);
            }
        }

        // push github user into db
        const user = await createGithubUser(
            githubUser.github_id, 
            githubUser.email, 
            githubUser.username
        );

        return jwtLogin(user, res, next);
    } catch(err) {
        next(err);
    }
};