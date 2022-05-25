const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const reviewsService = require("./reviews.service.js");


//reviewExists sends a read request from our service with the reviewId, if the review data exists it is stored in res.locals and used in the next function, if it is not an error is sent to our error handler.
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await reviewsService.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found" });
}


//read displays the data of the requested reviewId, only if the reviewId passed the reviewExists check.
function read(req, res) {
  res.json({ data: res.locals.review });
}

//destroy passes the given reviewId from request params into the delete function of reviewsService(which then removes the records related to that id from the table), then responds
async function destroy(req, res) {
  const { reviewId } = req.params;
  await reviewsService.delete(reviewId);
  res.status(204).send("No Content");
}

//update takes the information given from our request body and creates a review object with that data nd the given review_id, then the updatedReview is passed into our service.update to update the review in the table, updatedReview is saved into locals for use in the next function to attempt to keep single responsibility;
async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  res.locals.updatedReview = updatedReview;
  await reviewsService.update(updatedReview);
  next();
}

//readUpdate passes the updatedReview into showUpdate where it will respond with the updated review and altered critic keys;
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
