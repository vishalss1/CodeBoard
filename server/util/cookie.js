export const setRefreshTokenCookie = (res, token, maxAgeMs) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: false,
        maxAge: maxAgeMs
    });
};

export const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false
    });
};