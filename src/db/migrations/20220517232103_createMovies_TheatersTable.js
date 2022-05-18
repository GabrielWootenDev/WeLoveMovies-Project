exports.up = function (knex) {
  return knex.schema.createTable("movies_theaters", (table) => {
    table.integer("movie_id");
    table.integer("theater_id");
    table.foreign("movie_id").references("movie_id");
    table.foreign("theater_id").references("theater_id");
    table.boolean("is_showing");
  });
};

exports.down = function (knex) {};
