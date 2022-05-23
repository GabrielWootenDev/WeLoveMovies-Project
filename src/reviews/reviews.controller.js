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

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
