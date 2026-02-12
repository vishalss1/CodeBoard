import { db } from "../config/db.js";
import { users } from "../config/schema.js";
import { eq } from "drizzle-orm";

export const findByEmail = async (email: string) => {
    const user = await db
        .select({ 
            user_id: users.user_id, 
            email: users.email,
            password: users.password,
            username: users.username,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return user[0] ?? null;
};

export const findById = async (user_id: string) => {
    const user = await db
        .select({ 
            user_id: users.user_id 
        })
        .from(users)
        .where(eq(users.user_id, user_id))
        .limit(1);

    return user[0] ?? null;
};

export const createUser = async (email: string, password: string, username: string) => {
    const user = await db
        .insert(users).values({ 
            email: email, 
            password: password,
            username: username,
        })
        .returning({ user_id: users.user_id });

    return user[0] ?? null;
};

export const createGithubUser = async (github_id: string, email: string, username: string) => {
    const user = await db
        .insert(users).values({
            github_id: github_id,
            email: email,
            username: username,
        })
        .returning({ user_id: users.user_id, username: users.username });

    return user[0] ?? null;
}

export const findByGithubId = async (github_id: string) => {
    const user = await db
        .select({
            user_id: users.user_id,
            email: users.email,
            username: users.username,
        })
        .from(users)
        .where(eq(users.github_id, github_id))
        .limit(1);

    return user[0] ?? null;
};

export const insertGIdOnEmail = async (email: string, github_id: string) => {
    const user = await db
        .update(users)
        .set({
            github_id: github_id,
        })
        .where(eq(users.email, email))
        .returning({ user_id: users.user_id, username: users.username });

    return user[0] ?? null;
};