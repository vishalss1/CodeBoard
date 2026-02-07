import db from "../config/db.js";
import { refreshTokens } from "../config/schema.js";
import { eq } from "drizzle-orm";

export const upsertToken = async (token, user_id) => {
    const result = await db
        .insert(refreshTokens)
        .values({ token: token, user_id: user_id })
        .onConflictDoUpdate({ 
            target: refreshTokens.user_id,
            set: {
                token: token
            }
        })
        .returning({ user_id: refreshTokens.user_id, token: refreshTokens.token });

    return result[0] ?? null;
};

export const deleteToken = async (token) => {
    const result = await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.token, token))
        .returning({ user_id: refreshTokens.user_id });

    return result[0] ?? null;
};