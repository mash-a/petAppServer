
exports.up = function(knex, Promise) {
    return knex.schema.createTable('catsOrOtherPets', table => {
        table.increments();
        table.integer('user_id').references('id').inTable('users').index().onDelete('cascade');
        table.string('name');
        table.string('medication');
        table.string('special_needs');
        table.string('hiding_spots');
        table.integer('birthday');
        table.string('temperament');
        table.string('allergies');
        table.string('loud_noises');
        table.boolean('treats');
        table.string('feeding');
        table.string('img_url');
        table.timestamps(true, true);
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('catsOrOtherPets');
  };
  