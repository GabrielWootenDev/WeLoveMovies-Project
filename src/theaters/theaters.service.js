const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//reduceMovies will alter all the moveis for a theater_id in a response and add them into their own movie object with the key of movies
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at: ["movies", null, "created_at"],
  updated_at: ["movies", null, "updated_at"],
});

//list joins the theaters, movies_theaters, and movies tables and selects all the data, then uses reduceMovies on that data before returning the result;
async function list() {
  const result = await knex("theaters as t")
    .select("*")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .then(reduceMovies);
  return result;
}

module.exports = {
  list,
};
