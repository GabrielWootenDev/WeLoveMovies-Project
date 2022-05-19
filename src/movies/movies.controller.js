const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const moviesService = require("./movies.service.js");

async function showingAtTheater(req, res) {
  const theaters = await moviesService.showingAtTheater(req.params.movieId);
  res.json({ data: theaters });
}

// reviews needs more work
async function movieReviews(req, res) {
  const reviews = await moviesService.showReviews(req.params.movieId);
  res.json({ data: reviews });
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
  showReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(movieReviews)],
  showingAtTheater: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(showingAtTheater),
  ],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list),
};
