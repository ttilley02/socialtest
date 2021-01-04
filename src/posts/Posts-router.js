const express = require("express");
const PostsService = require("./Posts-service");
const { requireAuth } = require("../middleware/Jwt-auth");

const postsRouter = express.Router();


//gets listing of all post on the site
postsRouter.route("/").get((req, res, next) => {
  PostsService.getAllposts(req.app.get("db"))
    .then((posts) => {
      res.json(PostsService.serializeposts(posts));
    })
    .catch(next);
});

//gets listing of specific post on the site
postsRouter
  .route("/:post_id")
  .all(requireAuth)
  .all(checkpostExists)
  .get((req, res) => {
    res.json(PostsService.serializepost(res.post));
  });


//gets reviews of specific post on the site.
postsRouter 
  .route("/:post_id/reviews/")
  .all(requireAuth)
  .all(checkpostExists)
  .get((req, res, next) => {
    PostsService.getReviewsForpost(req.app.get("db"), req.params.post_id)
      .then((reviews) => {
        res.json(PostsService.serializepostReviews(reviews));
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkpostExists(req, res, next) {
  try {
    const post = await PostsService.getById(
      req.app.get("db"),
      req.params.post_id
    );

    if (!post)
      return res.status(404).json({
        error: `post doesn't exist`
      });

    res.post = post;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = postsRouter;
