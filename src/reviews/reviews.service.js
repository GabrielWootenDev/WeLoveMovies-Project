const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//reduceCritic will alter all the properties for a critic_id in a response and add them into their own object with the key of critic
const reduceCritic = reduceProperties("critic_id", {
  preferred_name: ["critic", null, "preferred_name"],
  surname: ["critic", null, "surname"],
  organization_name: ["critic", null, "organization_name"],
});

//read will retrieve and respond all data from the review table related to the given reviewId
async function read(reviewId) {
  const result = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
  return result;
}

//destroy selects all columns in the review table related to the given reviewId then deletes them from the table;
async function destroy(reviewId) {
  const result = await knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .del();
  return result;
}

//showUpdate joins the critics and reviews tables and selects all columns related to the review_id within the updated review before using reduceCritic and returning the data;
async function showUpdate(updatedReview) {
  const result = await knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ review_id: updatedReview.review_id })
    .then(reduceCritic);
  return result;
}

//update finds all columns related to the review_id within the updated review, then updates the with the information in updatedReview;
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
