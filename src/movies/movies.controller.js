const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js");
const moviesService = require("./movies.service.js");

//showingAtTheater takes the movieId from the request params and then calls showingAtTheater from our service with it to retrieve the list of theaters that movie is showing at, finally it returns that data as json.
async function showingAtTheater(req, res) {
  const { movieId } = req.params;
  const theaters = await moviesService.showingAtTheater(movieId);
  res.json({ data: theaters });
}

//showReviews takes the movieId and uses the showReviews in our service with it to retrieve a list of reviews for the movies, then it alters each review to include the critic information without the critic array and only the one relevant critic and responds with our list data as json.
async function showReviews(req, res) {
  const { movieId } = req.params;
  const reviews = await moviesService.showReviews(movieId);
  const reviewsResponse = reviews.map((review) => {
    review = {
      ...review,
      critic: review.critic[0],
    };
    return review;
  });
  res.json({ data: reviewsResponse });
}

//movieExists sends a read request from our service with the movieId, if the movie data exists it is stored in res.locals and used in the next function, if it is not an error is sent to our error handler.
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const data = await moviesService.read(movieId);

  if (data) {
    res.locals.movie = data;
    return next();
  }

  next({ status: 404, message: "Movie not found" });
}


//read displays the data of the requested movieId, only if the movie passed the movieExists check.
async function read(req, res) {
  res.json({ data: res.locals.movie });
}

//our list function will list all movies based on one of two conditions, if the query for is_showing = true then we only call the service listShowing for movies data currently showing, if false then all movies data will be listed in json with moviesService.list();
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
