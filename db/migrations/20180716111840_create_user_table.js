
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string()
  })
};

exports.down = (knex, Promise) => {
  
};
