const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritic = reduceProperties("critic_id", {
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
});

async function read(reviewId) {
  const result = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
  return result;
}

async function destroy(reviewId) {
  const result = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .del();
  return result;
}

async function showUpdate(updatedReview) {
  const result = await knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ review_id: updatedReview.review_id })
    .then(reduceCritic);
  return result;
}

async function update(updatedReview) {
  const result = await knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
  return result;
}

module.exports = {
  read,
  update,
  delete: destroy,
  showUpdate,
};
