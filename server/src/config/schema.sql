CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE posts (
  post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_posts_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE comments (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id)
    REFERENCES posts(post_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT refresh_tokens_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

  CONSTRAINT refresh_tokens_token_key UNIQUE (token),
  
  CONSTRAINT refresh_tokens_user_id_unique UNIQUE (user_id)
);

CREATE INDEX idx_posts_owner_id ON posts(owner_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);