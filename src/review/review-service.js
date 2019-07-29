const ReviewService = {
  getAllReviews(knex) {
    return knex
      .select(
        "reviews.id",
        "reviews.name",
        "reviews.image",
        "reviews.comment",
        "reviews.rating",
        "reviews.date_created",
        "reviews.user_id",
        "users.user_name"
      )
      .from("reviews")
      .join("users", { "users.id": "reviews.user_id" });
  },

  getById(knex, id) {
    return knex
      .from("reviews")
      .select("*")
      .where("id", id)
      .first();
  },

  insertReviews(knex, newReviews) {
    return knex
      .insert(newReviews)
      .into("reviews")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  deleteReviews(knex, id) {
    return knex("reviews")
      .where({ id })
      .delete();
  },

  updateReviews(knex, id, newReviewFields) {
    return knex("reviews")
      .where({ id })
      .update(newReviewFields);
  },

  getUserReviews(knex, user_id) {
    return knex
      .select("*")
      .where("user_id", user_id)
      .from("reviews");
  }
};

module.exports = ReviewService;
