
exports.up = function(knex, Promise) {
  return knex.schema.table('dogs', table => {
      table.string('img url');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('dogs', table => {
      table.dropColumn('img url');
  })
};
