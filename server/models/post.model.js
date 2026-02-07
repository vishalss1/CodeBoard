import db from "../config/db.js";
import { posts } from "../config/schema.js";
import { eq, sql, and } from "drizzle-orm";

export const createPost = async (title, code, language, owner_id) => {
    const post = await db
        .insert(posts)
        .values({
            title: title, 
            code: code, 
            language: language, 
            owner_id: owner_id 
        })
        .returning({ post_id: posts.post_id });

    return post[0] ?? null;
};

export const getPost = async (post_id) => {
    const post = await db
        .select({ 
            post_id: posts.post_id, 
            owner_id: posts.owner_id, 
            code: posts.code, 
            language: posts.language, 
            title: posts.title 
        })
        .from(posts)
        .where(eq(posts.post_id, post_id))
        .limit(1);

    return post[0] ?? null;
};

export const getAllPost = async () => {
    const post = await db
        .select({
            post_id: posts.post_id,
            owner_id: posts.owner_id,
            code: posts.code,
            language: posts.language,
            title: posts.title 
        })
        .from(posts);

    return post ?? null;
};

export const deletePost = async (post_id, owner_id) => {
    const post = await db
        .delete(posts)
        .where(and(
            eq(posts.post_id, post_id), 
            eq(posts.owner_id, owner_id)
        )).returning(posts.post_id);

    return post[0] ?? null;
};

export const updatePost = async (post_id, owner_id, title, code, language) => {
    const post = await db
        .update(posts)
        .set({
            updated_at: sql`NOW()`,
            title: title,
            code: code,
            language: language
        })
        .where(and(
            eq(posts.post_id, post_id), 
            eq(posts.owner_id, owner_id)
        ))
        .returning({ post_id: posts.post_id });

    return post[0] ?? null;
};