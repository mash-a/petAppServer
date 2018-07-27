
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('display_name').notNullable();
    table.string('access_token').notNullable();
    table.string('user_id').unique().notNullable();
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
};
