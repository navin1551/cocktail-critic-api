const app = require("../src/app");
const knex = require("knex");

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
  });
});
