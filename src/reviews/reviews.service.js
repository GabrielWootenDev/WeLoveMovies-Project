const knex = require("../db/connection");

async function read(reviewId) {
  const result = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
  return result;
}

async function destroy(reviewId) {
  const result = await knex("reviews").select("*").where({ review_id: reviewId }).del();
  return result;
}

module.exports = {
  read,
  delete: destroy,
};
