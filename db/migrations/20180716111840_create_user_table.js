
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('display_name').notNullable();
    table.text('access_token').notNullable();
    table.text('user_id').unique().notNullable();
    table.string('neighborhood');
    table.timestamps(true, true);
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
};
