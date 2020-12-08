const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");

describe("posts Endpoints", function () {
   let db;

   const { testUsers, testposts, testReviews } = helpers.makepostsFixtures();

   before("make knex instance", () => {
      db = knex({
         client: "pg",
         connection: process.env.TEST_DATABASE_URL,
      });
      app.set("db", db);
   });

   after("disconnect from db", () => db.destroy());

   before("cleanup", () => helpers.cleanTables(db));

   afterEach("cleanup", () => helpers.cleanTables(db));

   describe(`GET /api/posts`, () => {
      context(`Given no posts`, () => {
         it(`responds with 200 and an empty list`, () => {
            return supertest(app).get("/api/posts").expect(200, []);
         });
      });

      context("Given there are posts in the database", () => {
         beforeEach("insert posts", () =>
            helpers.seedpostsTables(db, testUsers, testposts, testReviews)
         );

         it("responds with 200 and all of the posts", () => {
            const expectedposts = testposts.map((post) =>
               helpers.makeExpectedpost(testUsers, post, testReviews)
            );
            return supertest(app).get("/api/posts").expect(200, expectedposts);
         });
      });

      context(`Given an XSS attack post`, () => {
         const testUser = helpers.makeUsersArray()[1];
         const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
            testUser
         );

         beforeEach("insert malicious post", () => {
            return helpers.seedMaliciouspost(db, testUser, maliciouspost);
         });

         it("removes XSS attack content", () => {
            return supertest(app)
               .get(`/api/posts`)
               .expect(200)
               .expect((res) => {
                  expect(res.body[0].title).to.eql(expectedpost.title);
                  expect(res.body[0].content).to.eql(expectedpost.content);
               });
         });
      });
   });
   describe("protected endpoints", () => {
      beforeEach("insert posts", () => {
         helpers.seedpostsTables(db, testUsers, testposts, testReviews);
      });
      describe("get /api/posts/:post_id", () => {
         it("responds with 401 missing basic token", () => {
            return supertest(app)
               .get("/api/posts/123")
               .expect(401, { error: "Missing bearer token" });
         });
      });
   });

   describe(`GET /api/posts/:post_id`, () => {
      context(`Given no posts`, () => {
         beforeEach(() => helpers.seedUsers(db, testUsers));
         it(`responds with 404`, () => {
            const postId = 123456;
            return supertest(app)
               .get(`/api/posts/${postId}`)
               .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
               .expect(404, { error: `post doesn't exist` });
         });
      });

      context("Given there are posts in the database", () => {
         beforeEach("insert posts", () =>
            helpers.seedpostsTables(db, testUsers, testposts, testReviews)
         );

         it("responds with 200 and the specified post", () => {
            const postId = 2;
            const expectedpost = helpers.makeExpectedpost(
               testUsers,
               testposts[postId - 1],
               testReviews
            );

            return supertest(app)
               .get(`/api/posts/${postId}`)
               .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
               .expect(200, expectedpost);
         });
      });

      context(`Given an XSS attack post`, () => {
         const testUser = helpers.makeUsersArray()[1];
         const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
            testUser
         );

         beforeEach("insert malicious post", () => {
            return helpers.seedMaliciouspost(db, testUser, maliciouspost);
         });

         it("removes XSS attack content", () => {
            return supertest(app)
               .get(`/api/posts/${maliciouspost.id}`)
               .set("Authorization", helpers.makeAuthHeader(testUser))
               .expect(200)
               .expect((res) => {
                  expect(res.body.title).to.eql(expectedpost.title);
                  expect(res.body.content).to.eql(expectedpost.content);
               });
         });
      });
   });

   describe(`GET /api/posts/:post_id/reviews`, () => {
      context(`Given no posts`, () => {
         beforeEach(() => helpers.seedUsers(db, testUsers));
         it(`responds with 404`, () => {
            const postId = 123456;
            return supertest(app)
               .get(`/api/posts/${postId}/reviews`)
               .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
               .expect(404, { error: `post doesn't exist` });
         });
      });

      context("Given there are reviews for post in the database", () => {
         beforeEach("insert posts", () =>
            helpers.seedpostsTables(db, testUsers, testposts, testReviews)
         );

         it("responds with 200 and the specified reviews", () => {
            const postId = 4;
            const expectedReviews = helpers.makeExpectedpostReviews(
               testUsers,
               postId,
               testReviews
            );

            return supertest(app)
               .get(`/api/posts/${postId}/reviews`)
               .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
               .expect(200, expectedReviews);
         });
      });
   });
});
