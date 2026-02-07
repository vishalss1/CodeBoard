import { db } from "../config/db.js";
import { comments } from "../config/schema.js";
import { eq, and, sql } from "drizzle-orm";

export const createComment = async (post_id, user_id, text) => {
    const comment = await db
        .insert(comments)
        .values({
            post_id: post_id,
            user_id: user_id,
            text: text
        })
        .returning({ comment_id: comments.comment_id, text: comments.text });

    return comment[0] ?? null;
};

export const getComment = async (comment_id) => {
    const comment = await db
        .select({
            comment_id: comments.comment_id,
            post_id: comments.post_id,
            user_id: comments.user_id,
            text: comments.text
        })
        .from(comments)
        .where(eq(comments.comment_id, comment_id))
        .limit(1);

    return comment[0] ?? null;
};

export const getAllComments = async (post_id) => {
    const comment = await db
        .select({
            post_id: comments.post_id,
            user_id: comments.user_id,
            comment_id: comments.comment_id,
            text: comments.text
        })
        .from(comments)
        .where(eq(comments.post_id, post_id));

    return comment;
};

export const deleteComment = async (comment_id, user_id) => {
    const comment = await db
        .delete(comments)
        .where(and(
            eq(comments.comment_id, comment_id),
            eq(comments.user_id, user_id)
        ))
        .returning({
            comment_id: comments.comment_id
        });

    return comment[0] ?? null;
};

export const updateComment = async (comment_id, user_id, text) => {
    const comment = await db
        .update(comments)
        .set({
            updated_at: sql`NOW()`,
            text: text
        })
        .where(and(
            eq(comments.comment_id, comment_id),
            eq(comments.user_id, user_id)
        ))
        .returning({
            comment_id: comments.comment_id,
            text: comments.text
        });

    return comment[0] ?? null;
};