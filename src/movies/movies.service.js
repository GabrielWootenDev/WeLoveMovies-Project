const knex = require("../db/connection");

async function list() {
    const result = knex("movies").select("*");
    return result;
}

module.exports = {
    list,
}