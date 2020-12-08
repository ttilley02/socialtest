const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
   return [
      {
         id: 1,
         user_name: "test-user-1",
         full_name: "Test user 1",
         nickname: "TU1",
         password: "password",
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 2,
         user_name: "test-user-2",
         full_name: "Test user 2",
         nickname: "TU2",
         password: "password",
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 3,
         user_name: "test-user-3",
         full_name: "Test user 3",
         nickname: "TU3",
         password: "password",
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 4,
         user_name: "test-user-4",
         full_name: "Test user 4",
         nickname: "TU4",
         password: "password",
         date_created: "2029-01-22T16:28:32.615Z",
      },
   ];
}

function makepostsArray(users) {
   return [
      {
         id: 1,
         title: "First test post!",
         image: "http://placehold.it/500x500",
         user_id: users[0].id,
         date_created: "2029-01-22T16:28:32.615Z",
         content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
      },
      {
         id: 2,
         title: "Second test post!",
         image: "http://placehold.it/500x500",
         user_id: users[1].id,
         date_created: "2029-01-22T16:28:32.615Z",
         content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
      },
      {
         id: 3,
         title: "Third test post!",
         image: "http://placehold.it/500x500",
         user_id: users[2].id,
         date_created: "2029-01-22T16:28:32.615Z",
         content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
      },
      {
         id: 4,
         title: "Fourth test post!",
         image: "http://placehold.it/500x500",
         user_id: users[3].id,
         date_created: "2029-01-22T16:28:32.615Z",
         content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
      },
   ];
}

function makeReviewsArray(users, posts) {
   return [
      {
         id: 1,
         rating: 2,
         text: "First test review!",
         post_id: posts[0].id,
         user_id: users[0].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 2,
         rating: 3,
         text: "Second test review!",
         post_id: posts[0].id,
         user_id: users[1].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 3,
         rating: 1,
         text: "Third test review!",
         post_id: posts[0].id,
         user_id: users[2].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 4,
         rating: 5,
         text: "Fourth test review!",
         post_id: posts[0].id,
         user_id: users[3].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 5,
         rating: 1,
         text: "Fifth test review!",
         post_id: posts[posts.length - 1].id,
         user_id: users[0].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 6,
         rating: 2,
         text: "Sixth test review!",
         post_id: posts[posts.length - 1].id,
         user_id: users[2].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
      {
         id: 7,
         rating: 5,
         text: "Seventh test review!",
         post_id: posts[3].id,
         user_id: users[0].id,
         date_created: "2029-01-22T16:28:32.615Z",
      },
   ];
}

function makeExpectedpost(users, post, reviews = []) {
   const user = users.find((user) => user.id === post.user_id);

   const postReviews = reviews.filter((review) => review.post_id === post.id);

   const number_of_reviews = postReviews.length;
   const average_review_rating = calculateAverageReviewRating(postReviews);

   return {
      id: post.id,
      image: post.image,
      title: post.title,
      content: post.content,
      date_created: post.date_created,
      number_of_reviews,
      average_review_rating,
      user: {
         id: user.id,
         user_name: user.user_name,
         full_name: user.full_name,
         nickname: user.nickname,
         date_created: user.date_created,
      },
   };
}

function calculateAverageReviewRating(reviews) {
   if (!reviews.length) return 0;

   const sum = reviews.map((review) => review.rating).reduce((a, b) => a + b);

   return Math.round(sum / reviews.length);
}

function makeExpectedpostReviews(users, postId, reviews) {
   const expectedReviews = reviews.filter(
      (review) => review.post_id === postId
   );

   return expectedReviews.map((review) => {
      const reviewUser = users.find((user) => user.id === review.user_id);
      return {
         id: review.id,
         text: review.text,
         rating: review.rating,
         date_created: review.date_created,
         user: {
            id: reviewUser.id,
            user_name: reviewUser.user_name,
            full_name: reviewUser.full_name,
            nickname: reviewUser.nickname,
            date_created: reviewUser.date_created,
         },
      };
   });
}

function makeMaliciouspost(user) {
   const maliciouspost = {
      id: 911,
      image: "http://placehold.it/500x500",
      date_created: new Date().toISOString(),
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      user_id: user.id,
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
   };
   const expectedpost = {
      ...makeExpectedpost([user], maliciouspost),
      title:
         'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
   };
   return {
      maliciouspost,
      expectedpost,
   };
}

function makepostsFixtures() {
   const testUsers = makeUsersArray();
   const testposts = makepostsArray(testUsers);
   const testReviews = makeReviewsArray(testUsers, testposts);
   return { testUsers, testposts, testReviews };
}

function cleanTables(db) {
   return db.transaction((trx) =>
      trx
         .raw(
            `TRUNCATE
      social_posts,
      social_users,
      social_reviews
      RESTART IDENTITY CASCADE
      `
         )

         .then(() =>
            Promise.all([
               trx.raw(
                  `ALTER SEQUENCE social_posts_id_seq minvalue 0 START WITH 1`
               ),
               trx.raw(
                  `ALTER SEQUENCE social_users_id_seq minvalue 0 START WITH 1`
               ),
               trx.raw(
                  `ALTER SEQUENCE social_reviews_id_seq minvalue 0 START WITH 1`
               ),
               trx.raw(`SELECT setval('social_posts_id_seq', 0)`),
               trx.raw(`SELECT setval('social_users_id_seq', 0)`),
               trx.raw(`SELECT setval('social_reviews_id_seq', 0)`),
            ])
         )
   );
}

function seedUsers(db, users) {
   const preppedUsers = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1),
   }));
   return db
      .into("social_users")
      .insert(preppedUsers)
      .then(() =>
         // update the auto sequence to stay in sync
         db.raw(`SELECT setval('social_users_id_seq', ?)`, [
            users[users.length - 1].id,
         ])
      );
}

function seedpostsTables(db, users, posts, reviews = []) {
   // use a transaction to group the queries and auto rollback on any failure
   return db.transaction(async (trx) => {
      await seedUsers(trx, users);
      await trx.into("social_posts").insert(posts);
      // update the auto sequence to match the forced id values
      await Promise.all([
         trx.raw(`SELECT setval('social_users_id_seq', ?)`, [
            users[users.length - 1].id,
         ]),
         trx.raw(`SELECT setval('social_posts_id_seq', ?)`, [
            posts[posts.length - 1].id,
         ]),
      ]);
      // only insert reviews if there are some, also update the sequence counter
      if (reviews.length) {
         await trx.into("social_reviews").insert(reviews);
         await trx.raw(`SELECT setval('social_reviews_id_seq', ?)`, [
            reviews[reviews.length - 1].id,
         ]);
      }
   });
}

function seedMaliciouspost(db, user, post) {
   return seedUsers(db, [user]).then(() =>
      db.into("social_posts").insert([post])
   );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
   const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: "HS256",
   });
   return `Bearer ${token}`;
}

module.exports = {
   makeUsersArray,
   makepostsArray,
   makeExpectedpost,
   makeExpectedpostReviews,
   makeMaliciouspost,
   makeReviewsArray,

   makepostsFixtures,
   cleanTables,
   seedpostsTables,
   seedMaliciouspost,
   makeAuthHeader,
   seedUsers,
};
