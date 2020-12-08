CREATE TABLE social_users
(
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);

ALTER TABLE social_posts
  ADD COLUMN
    user_id INTEGER REFERENCES social_users
(id)
    ON
DELETE
SET NULL;
