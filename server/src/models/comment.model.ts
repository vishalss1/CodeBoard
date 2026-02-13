import { db } from "../config/db.js";
import { comments, users } from "../config/schema.js";
import { eq, and } from "drizzle-orm";

export const createComment = async (post_id: string, user_id: string, text: string) => {
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

export const getComment = async (comment_id: string) => {
    const comment = await db
        .select({
            comment_id: comments.comment_id,
            post_id: comments.post_id,
            user_id: comments.user_id,
            text: comments.text,
            username: users.username,
        })
        .from(comments)
        .innerJoin(users, eq(comments.user_id, users.user_id))
        .where(eq(comments.comment_id, comment_id))
        .limit(1);

    return comment[0] ?? null;
};

export const getAllComments = async (post_id: string) => {
    const comment = await db
        .select({
            post_id: comments.post_id,
            user_id: comments.user_id,
            comment_id: comments.comment_id,
            text: comments.text,
            username: users.username,
        })
        .from(comments)
        .innerJoin(users, eq(comments.user_id, users.user_id))
        .where(eq(comments.post_id, post_id));

    return comment;
};

export const deleteComment = async (comment_id: string, user_id: string) => {
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

export const updateComment = async (comment_id: string, user_id: string, text: string) => {
    const comment = await db
        .update(comments)
        .set({
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