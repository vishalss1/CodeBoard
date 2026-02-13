import { pgTable, uniqueIndex, uuid, text, timestamp, foreignKey, unique, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	userId: uuid("user_id").defaultRandom().primaryKey().notNull(),
	email: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	username: text(),
	githubId: text("github_id"),
}, (table) => [
	uniqueIndex("users_email_unique").using("btree", table.email.asc().nullsLast().op("text_ops")).where(sql`(email IS NOT NULL)`),
	uniqueIndex("users_github_id_unique").using("btree", table.githubId.asc().nullsLast().op("text_ops")).where(sql`(github_id IS NOT NULL)`),
	uniqueIndex("users_username_unique").using("btree", table.username.asc().nullsLast().op("text_ops")).where(sql`(username IS NOT NULL)`),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "refresh_tokens_user_id_fkey"
		}).onDelete("cascade"),
	unique("refresh_tokens_token_key").on(table.token),
	unique("refresh_tokens_user_id_unique").on(table.userId),
]);

export const posts = pgTable("posts", {
	postId: uuid("post_id").defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	code: text().notNull(),
	language: text().notNull(),
	ownerId: uuid("owner_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_posts_owner_id").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.userId],
			name: "fk_posts_owner"
		}).onDelete("cascade"),
]);

export const comments = pgTable("comments", {
	commentId: uuid("comment_id").defaultRandom().primaryKey().notNull(),
	text: text().notNull(),
	postId: uuid("post_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_comments_post_id").using("btree", table.postId.asc().nullsLast().op("uuid_ops")),
	index("idx_comments_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.postId],
			name: "fk_comments_post"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "fk_comments_user"
		}).onDelete("cascade"),
]);
