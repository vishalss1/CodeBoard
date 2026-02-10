import type { Response } from "express";

export const setRefreshTokenCookie = (res: Response, token: string, maxAgeMs: number) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: false,
        maxAge: maxAgeMs
    });
};

export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false
    });
};