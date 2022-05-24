const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritic = reduceProperties("critic_id", {
  critic_id: ["critic", null, "critic_id"],
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
  created_at: ["critic", null, "created_at"],
  updated_at: ["critic", null, "updated_at"],
});

function showReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ movie_id: movieId })
    .then(reduceCritic);
}

async function showingAtTheater(movieId) {
  return await knex("theaters as t")
    .select("*")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .where({ movie_id: movieId }, { is_showing: true });
}

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

async function read(movieId) {
  return await knex("movies").select("*").where({ movie_id: movieId }).first();
}

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
