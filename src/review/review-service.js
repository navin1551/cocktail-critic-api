const ReviewService = {
  getAllReviews(knex) {
    return knex
      .select(
        "reviews.id",
        "reviews.name",
        "reviews.image",
        "reviews.comment",
        "reviews.rating",
        "reviews.date_created"
      )
      .from("reviews");
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
  }
};

module.exports = ReviewService;
