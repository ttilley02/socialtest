
CREATE TABLE social_reviews
(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    post_id INTEGER
        REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES social_users(id) ON DELETE CASCADE NOT NULL
);