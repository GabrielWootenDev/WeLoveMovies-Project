const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//reduce critic will alter all the properties for a critic_id in a response and add them into their own object with the key of critic
const reduceCritic = reduceProperties("critic_id", {
  critic_id: ["critic", null, "critic_id"],
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
  created_at: ["critic", null, "created_at"],
  updated_at: ["critic", null, "updated_at"],
});

//showReviews joins data from the review table and the critic table the displays all information related to the given movie_id, then alters the response to 6give all the critic information its own object with reduceCritic;
function showReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ movie_id: movieId })
    .then(reduceCritic);
}

//showingAtTheater joins the theaters and movies tables and selects all the data for the given movieId and only if it is showing at any theater
async function showingAtTheater(movieId) {
  return await knex("theaters as t")
    .select("*")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .where({ movie_id: movieId }, { is_showing: true });
}

//listShowing joins the movie and theaters tables and responds with all movies data currently showing at any theater;
async function listShowing() {
  return await knex("movies as m")
    .select(
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.description",
      "m.image_url"
    )
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where({ is_showing: true })
    .groupBy("m.movie_id");
}

//read selects and responds with all the data for the given movieId
async function read(movieId) {
  return await knex("movies").select("*").where({ movie_id: movieId }).first();
}

//list selects and responds with all of the data in the movies table;
async function list() {
  return await knex("movies").select("*");
}

module.exports = {
  read,
  list,
  listShowing,
  showingAtTheater,
  showReviews,
};
