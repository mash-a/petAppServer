
exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('email').unique().notNullable();
    table.string('profilePic').notNullable();
    table.string('displayName').notNullable();
    table.string('accessToken').notNullable();
    table.string('userID').unique().notNullable();
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
};
