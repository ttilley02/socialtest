const xss = require("xss");
const Treeize = require("treeize");

const postsService = {
   getAllposts(db) {
      return db
         .from("social_posts AS thg")
         .select(
            "thg.id",
            "thg.title",
            "thg.date_created",
            "thg.content",
            "thg.image",
            ...userFields,
            db.raw(`count(DISTINCT rev) AS number_of_reviews`),
            db.raw(`AVG(rev.rating) AS average_review_rating`)
         )
         .leftJoin("social_reviews AS rev", "thg.id", "rev.post_id")
         .leftJoin("social_users AS usr", "thg.user_id", "usr.id")
         .groupBy("thg.id", "usr.id");
   },

   getById(db, id) {
      return postsService.getAllposts(db).where("thg.id", id).first();
   },

   getReviewsForpost(db, post_id) {
      return db
         .from("social_reviews AS rev")
         .select(
            "rev.id",
            "rev.rating",
            "rev.text",
            "rev.date_created",
            ...userFields
         )
         .where("rev.post_id", post_id)
         .leftJoin("social_users AS usr", "rev.user_id", "usr.id")
         .groupBy("rev.id", "usr.id");
   },

   serializeposts(posts) {
      return posts.map(this.serializepost);
   },

   serializepost(post) {
      const postTree = new Treeize();

      // Some light hackiness to allow for the fact that `treeize`
      // only accepts arrays of objects, and we want to use a single
      // object.
      const postData = postTree.grow([post]).getData()[0];

      return {
         id: postData.id,
         title: xss(postData.title),
         content: xss(postData.content),
         date_created: postData.date_created,
         image: postData.image,
         user: postData.user || {},
         number_of_reviews: Number(postData.number_of_reviews) || 0,
         average_review_rating: Math.round(postData.average_review_rating) || 0,
      };
   },

   serializepostReviews(reviews) {
      return reviews.map(this.serializepostReview);
   },

   serializepostReview(review) {
      const reviewTree = new Treeize();

      // Some light hackiness to allow for the fact that `treeize`
      // only accepts arrays of objects, and we want to use a single
      // object.
      const reviewData = reviewTree.grow([review]).getData()[0];

      return {
         id: reviewData.id,
         rating: reviewData.rating,
         post_id: reviewData.post_id,
         text: xss(reviewData.text),
         user: reviewData.user || {},
         date_created: reviewData.date_created,
      };
   },
};

const userFields = [
   "usr.id AS user:id",
   "usr.user_name AS user:user_name",
   "usr.full_name AS user:full_name",
   "usr.nickname AS user:nickname",
   "usr.date_created AS user:date_created",
   "usr.date_modified AS user:date_modified",
];

module.exports = postsService;
