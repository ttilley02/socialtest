ALTER TABLE social_posts
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS thingful_users CASCADE;