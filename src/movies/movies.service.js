const knex = require("../db/connection");

async function list() {
    const result = knex("movies").select("*");
    return result;
}

function listShowing() {
    return knex("movies as m")
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
    const result = knex("movies").select("*").where({movie_id: movieId}).first();
    return result;
}

module.exports = {
    list,
    listShowing,
    read,
}