import { relations } from "drizzle-orm/relations";
import { users, posts, comments, refreshTokens } from "./schema.js";

export const postsRelations = relations(posts, ({one, many}) => ({
	user: one(users, {
		fields: [posts.owner_id],
		references: [users.user_id]
	}),
	comments: many(comments),
}));

export const usersRelations = relations(users, ({many}) => ({
	posts: many(posts),
	comments: many(comments),
	refreshTokens: many(refreshTokens),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	post: one(posts, {
		fields: [comments.post_id],
		references: [posts.post_id]
	}),
	user: one(users, {
		fields: [comments.user_id],
		references: [users.user_id]
	}),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.user_id],
		references: [users.user_id]
	}),
}));