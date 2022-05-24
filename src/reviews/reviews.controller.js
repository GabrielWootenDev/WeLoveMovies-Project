const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const reviewsService = require("./reviews.service.js");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await reviewsService.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found" });
}

function read(req, res) {
  res.json({ data: res.locals.review });
}

async function destroy(req, res) {
  const { reviewId } = req.params;
  await reviewsService.delete(reviewId);
  res.status(204).send("No Content");
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  res.locals.updatedReview = updatedReview;
  await reviewsService.update(updatedReview);
  next();
}

async function readUpdate(req, res) {
  const showUpdate = await reviewsService.showUpdate(res.locals.updatedReview);
  const review = showUpdate[0];
  const newReview = {
    ...review,
    critic: review.critic[0],
  };

  res.status(201).json({ data: newReview });
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
    asyncErrorBoundary(readUpdate),
  ],
};
