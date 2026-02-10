import { pgTable, unique, uuid, text, timestamp, index, foreignKey } from "drizzle-orm/pg-core";



export const users = pgTable("users", {
	user_id: uuid("user_id").defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const posts = pgTable("posts", {
	post_id: uuid("post_id").defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	code: text().notNull(),
	language: text().notNull(),
	owner_id: uuid("owner_id").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_posts_owner_id").using("btree", table.owner_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.owner_id],
			foreignColumns: [users.user_id],
			name: "fk_posts_owner"
		}).onDelete("cascade"),
]);

export const comments = pgTable("comments", {
	comment_id: uuid("comment_id").defaultRandom().primaryKey().notNull(),
	text: text().notNull(),
	post_id: uuid("post_id").notNull(),
	user_id: uuid("user_id").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_comments_post_id").using("btree", table.post_id.asc().nullsLast().op("uuid_ops")),
	index("idx_comments_user_id").using("btree", table.user_id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.post_id],
			foreignColumns: [posts.post_id],
			name: "fk_comments_post"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.user_id],
			name: "fk_comments_user"
		}).onDelete("cascade"),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	user_id: uuid("user_id").notNull(),
	token: text().notNull(),
	created_id: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.user_id],
			name: "refresh_tokens_user_id_fkey"
		}).onDelete("cascade"),
	unique("refresh_tokens_token_key").on(table.token),
	unique("refresh_tokens_user_id_unique").on(table.user_id), // change when scaling to multi device login
]);
