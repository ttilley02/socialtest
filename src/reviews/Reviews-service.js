const xss = require("xss");

const ReviewsService = {
  getById(db, id) {
    return db
      .from("postful_reviews AS rev")
      .select(
        "rev.id",
        "rev.rating",
        "rev.text",
        "rev.date_created",
        "rev.post_id",
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.nickname,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin("postful_users AS usr", "rev.user_id", "usr.id")
      .where("rev.id", id)
      .first();
  },

  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into("postful_reviews")
      .returning("*")
      .then(([review]) => review)
      .then((review) => ReviewsService.getById(db, review.id));
  },

  serializeReview(review) {
    return {
      id: review.id,
      rating: review.rating,
      text: xss(review.text),
      post_id: review.post_id,
      date_created: review.date_created,
      user: review.user || {}
    };
  }
};

module.exports = ReviewsService;
