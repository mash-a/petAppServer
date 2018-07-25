
exports.up = function(knex, Promise) {
  return knex.schema.createTable('dogs', table => {
      table.increments();
      table.integer('user_id').references('id').inTable('users').index().onDelete('cascade');
      table.string('name');
      table.string('medication');
      table.string('special needs');
      table.string('walk requirements');
      table.integer('DOB');
      table.string('temperament');
      table.string('allergies');
      table.string('loud noises');
      table.boolean('treats');
      table.string('other');
      table.string('feeding')
      table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('dogs');
};
