import { relations } from "drizzle-orm/relations";
import { users, refreshTokens, posts, comments } from "./schema";

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.userId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	refreshTokens: many(refreshTokens),
	posts: many(posts),
	comments: many(comments),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	user: one(users, {
		fields: [posts.ownerId],
		references: [users.userId]
	}),
	comments: many(comments),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.postId]
	}),
	user: one(users, {
		fields: [comments.userId],
		references: [users.userId]
	}),
}));