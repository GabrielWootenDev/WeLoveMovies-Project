const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const moviesService = require("./movies.service.js");

async function showingAtTheater(req, res) {
  const { movieId } = req.params;
  const theaters = await moviesService.showingAtTheater(movieId);
  res.json({ data: theaters });
}

async function showReviews(req, res) {
  const { movieId } = req.params;
  const reviews = await moviesService.showReviews(movieId);
  const reviewsResponse = [];
  reviews.map((review) => {
    newReview = {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic_id: review.critic_id,
      movie_id: review.movie_id,
      critic: review.critic[0],
    };
    reviewsResponse.push(newReview);
  });
  res.json({ data: reviewsResponse });
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const data = await moviesService.read(movieId);

  if (data) {
    res.locals.movie = data;
    return next();
  }

  return next({ status: 404, message: "Movie not found" });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function list(req, res) {
  const showing = req.query.is_showing;
  if (showing) {
    const data = await moviesService.listShowing();
    res.json({ data: data });
  } else {
    const data = await moviesService.list();
    res.json({ data: data });
  }
}

module.exports = {
  showReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(showReviews),
  ],
  showingAtTheater: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(showingAtTheater),
  ],
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
};
