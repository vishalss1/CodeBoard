import { db } from "../config/db.js";
import { posts, users } from "../config/schema.js";
import { eq, sql, and } from "drizzle-orm";

export const createPost = async (title: string, code: string, language: string, owner_id: string) => {
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

export const getPost = async (post_id: string) => {
    const post = await db
        .select({ 
            post_id: posts.post_id, 
            owner_id: posts.owner_id,
            username: users.username, 
            code: posts.code, 
            language: posts.language, 
            title: posts.title 
        })
        .from(posts)
        .innerJoin(users, eq(posts.owner_id, users.user_id))
        .where(eq(posts.post_id, post_id))
        .limit(1);

    return post[0] ?? null;
};

export const getAllPost = async () => {
    const post = await db
        .select({
            post_id: posts.post_id,
            owner_id: posts.owner_id,
            username: users.username,
            code: posts.code,
            language: posts.language,
            title: posts.title 
        })
        .from(posts)
        .innerJoin(users, eq(posts.owner_id, users.user_id));

    return post ?? null;
};

export const deletePost = async (post_id: string, owner_id: string) => {
    const post = await db
        .delete(posts)
        .where(and(
            eq(posts.post_id, post_id), 
            eq(posts.owner_id, owner_id)
        )).returning({ post_id: posts.post_id });

    return post[0] ?? null;
};

interface PostUpdate {
  title: string;
  code: string;
  language: string;
}

export const updatePost = async (post_id: string, owner_id: string, updates: Partial<PostUpdate>) => {
  const updateData: Partial<PostUpdate & { updated_at: any }> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.code !== undefined) updateData.code = updates.code;
  if (updates.language !== undefined) updateData.language = updates.language;

  updateData.updated_at = sql`NOW()`;

  const post = await db
    .update(posts)
    .set(updateData)
    .where(
      and(
        eq(posts.post_id, post_id),
        eq(posts.owner_id, owner_id)
      )
    )
    .returning({ post_id: posts.post_id });

  return post[0] ?? null;
};