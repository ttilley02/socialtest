require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const postsRouter = require("./posts/Posts-router");
const reviewsRouter = require("./reviews/Reviews-router");
const authRouter = require("./auth/Auth-router");
const userRouter = require("./users/users-router");

const app = express();

app.use(
   morgan(NODE_ENV === "production" ? "tiny" : "common", {
      skip: () => NODE_ENV === "test",
   })
);
app.use(cors());
app.use(helmet());

app.use("/api/posts", postsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use(function errorHandler(error, req, res, next) {
   let response;
   if (NODE_ENV === "production") {
      response = { error: "Server error" };
   } else {
      console.error(error);
      response = { error: error.message, object: error };
   }
   res.status(500).json(response);
});

module.exports = app;
