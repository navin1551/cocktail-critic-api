const app = require("../src/app");
const knex = require("knex");
const { makeReviewsArray } = require("./reviews.fixtures");
const jwt = require("jsonwebtoken");

describe("Review Endpoints", function() {
  let db;

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: "HS256"
    });
    return `bearer ${token}`;
  }

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

  describe("GET /api/reviews/:id", () => {
    context("Given no reviews", () => {
      it("responds with 404", () => {
        const id = 123456;
        return supertest(app)
          .get(`/api/reviews/${id}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    context("Given there are reviews in the database", () => {
      const testReview = [
        {
          id: 1,
          name: "Test name",
          image: "Test image",
          comment: "Test comment",
          rating: 1,
          date_created: "2029-01-22T16:28:32.615Z"
        }
      ];

      beforeEach("insert reviews", () => {
        return db.into("reviews").insert(testReview);
      });

      it("responds with 200 and the specified post", () => {
        const id = 1;
        const expectedReview = testReview[id - 1];
        return supertest(app)
          .get(`/api/reviews/${id}`)
          .expect(200, expectedReview);
      });
    });
  });

  describe("POST /api/reviews", () => {
    it("creates a review, responding with 201 and the new review", () => {
      this.retries(3);
      const newReview = {
        id: 1,
        name: "Test new name",
        image: "https://image.com/images.jpeg",
        comment: "Test comment",
        rating: 1,
        date_created: "2029-01-22T16:28:32.615Z"
      };

      const testUser = {
        id: 1,
        first_name: "Test",
        last_name: "User",
        email: "testemail1@email.com",
        user_name: "testuser1",
        password: "password1"
      };

      return supertest(app)
        .post("/api/reviews")
        .send(newReview)
        .set("Authorization", makeAuthHeader(testUser))
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

  describe("DELETE /api/reviews/:id", () => {
    context("Given no reviews", () => {
      it("responds with 404", () => {
        const id = 123456;
        return supertest(app)
          .delete(`/api/reviews/${id}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    /*context("Given there are reviews in the database", () => {
      const testReviews = [
        {
          id: 1,
          name: "Test name",
          image: "Test image",
          comment: "Test comment",
          rating: 1,
          date_created: "2029-01-22T16:28:32.615Z"
        },
        {
          id: 2,
          name: "Test name2",
          image: "Test image2",
          comment: "Test comment2",
          rating: 2,
          date_created: "2029-01-22T16:28:32.615Z"
        },
        {
          id: 3,
          name: "Test name3",
          image: "Test image3",
          comment: "Test comment3",
          rating: 3,
          date_created: "2029-01-22T16:28:32.615Z"
        }
      ];

      beforeEach("insert reviews", () => {
        return db.into("reviews").insert(testReviews);
      });

      it("responds with 204 and removes the review", () => {
        const idToRemove = 1;
        const expectedReviews = testReviews.filter(
          review => review.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/reviews")
              .expect(expectedReviews)
          );
      });
    });*/
  });

  describe("PATCH /api/reviews/:id", () => {
    context("Given no reviews", () => {
      it("responds with 404", () => {
        const id = 123456;
        return supertest(app)
          .patch(`/api/reviews/${id}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    /*context("Given there are reviews in the database", () => {
      const testReviews = [
        {
          name: "Test name",
          image: "Test image",
          comment: "Test comment",
          rating: 1
        }
      ];

      beforeEach("insert reviews", () => {
        return db.into("reviews").insert(testReviews);
      });

      it("responds with 204 and updates the review", () => {
        const idToUpdate = 1;

        const updateReview = {
          name: "update test name",
          image: "update test image",
          comment: "update test comment",
          rating: 2
        };

        const expectedReview = {
          ...testReviews[idToUpdate - 1],
          ...updateReview
        };

        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .send(updateReview)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/reviews/${idToUpdate}`)
              .expect(expectedReview)
          );
      });
    });*/
  });
});
