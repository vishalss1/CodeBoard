import { db } from "../config/db.js";
import { users } from "../config/schema.js";
import { eq } from "drizzle-orm";

export const findByEmail = async (email) => {
    const user = await db
        .select({ 
            user_id: users.user_id, 
            email: users.email,
            password: users.password 
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return user[0] ?? null;
};

export const findById = async (user_id) => {
    const user = await db
        .select({ 
            user_id: users.user_id 
        })
        .from(users)
        .where(eq(users.user_id, user_id))
        .limit(1);

    return user[0] ?? null;
};

export const createUser = async (email, password) => {
    const user = await db
        .insert(users).values({ 
            email: email, 
            password: password 
        })
        .returning({ user_id: users.user_id });

    return user[0] ?? null;
};