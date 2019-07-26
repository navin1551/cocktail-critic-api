const express = require("express");
const ReviewService = require("./review-service");

const reviewRouter = express.Router();
const jsonParser = express.json();

const serializedReviews = review => ({
  id: review.id,
  name: review.name,
  image: review.image,
  comment: review.comment,
  rating: review.rating,
  date_created: review.date_created
});

reviewRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ReviewService.getAllReviews(knexInstance)
      .then(reviews => {
        res.json(reviews);
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id, name, image, comment, rating, date_created } = req.body;
    const newReview = { id, name, image, comment, rating, date_created };
    ReviewService.insertReviews(knexInstance, newReview)
      .then(review => {
        res
          .status(201)
          .location(`/api/reviews/${review.id}`)
          .json(review);
      })
      .catch(next);
  });

module.exports = reviewRouter;
