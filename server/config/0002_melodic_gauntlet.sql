ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "fk_comments_username";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "fk_posts_username";
--> statement-breakpoint
DROP INDEX "idx_comments_username";--> statement-breakpoint
DROP INDEX "idx_posts_username";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "username";