const express = require("express");
const ReviewService = require("./review-service");
const { requireAuth } = require("../middleware/basic-auth");
const xss = require("xss");

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

  .post(requireAuth, jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    console.log(req.body);
    const { id, name, image, comment, rating, date_created } = req.body;
    const newReview = { id, name, image, comment, rating, date_created };

    newReview.user_id = req.user.id;

    ReviewService.insertReviews(knexInstance, newReview)
      .then(review => {
        res
          .status(201)
          .location(`/api/reviews/${review.id}`)
          .json(review);
      })
      .catch(next);
  });

reviewRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;

    ReviewService.getById(knexInstance, id)
      .then(review => {
        if (!review) {
          return res.status(404).json({
            error: { message: `Review doesn't exist` }
          });
        }
        res.review = review;
        res.json({
          id: review.id,
          name: xss(review.name),
          image: xss(review.image),
          comment: xss(review.comment),
          rating: review.rating,
          date_created: review.date_created
        });
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializedReviews(res.review));
  })

  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;

    ReviewService.deleteReviews(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { name, image, comment, rating } = req.body;
    const reviewToUpdate = { name, image, comment, rating };
    const knexInstance = req.app.get("db");

    ReviewService.updateReviews(knexInstance, req.params.id, reviewToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = reviewRouter;
