const app = require("../src/app");
const knex = require("knex");
const { makeReviewsArray } = require("./reviews.fixtures");

describe("Review Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE reviews RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE reviews RESTART IDENTITY CASCADE")
  );

  describe("GET /api/reviews", () => {
    context("Given no reviews", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/reviews")
          .expect(200, []);
      });
    });
    context("Given there are reviews in the database", () => {
      const testReviews = makeReviewsArray();

      beforeEach("insert reviews", () => {
        return db.into("reviews").insert(testReviews);
      });

      it("responds with 200 and all of the reviews", () => {
        return supertest(app)
          .get("/api/reviews")
          .expect(200, testReviews);
      });
    });
  });

  describe("POST /api/reviews", () => {
    it("creates a review, responding with 201 and the new review", () => {
      const newReview = {
        name: "Test new name",
        image: "https://image.com/images.jpeg",
        comment: "Test comment",
        rating: 1
      };

      return supertest(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newReview.name);
          expect(res.body.image).to.eql(newReview.image);
          expect(res.body.comment).to.eql(newReview.comment);
          expect(res.body.rating).to.eql(newReview.rating);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.date_created).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then(res =>
          supertest(app)
            .get(`/api/reviews/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
});
