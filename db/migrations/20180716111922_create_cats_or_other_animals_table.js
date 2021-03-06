
exports.up = function(knex, Promise) {
    return knex.schema.createTable('catsOrOtherPets', table => {
        table.increments();
        table.integer('user_id').references('id').inTable('users').index().onDelete('cascade');
        table.string('name');
        table.text('medication');
        table.text('special_needs');
        table.text('hiding_spots');
        table.integer('birthday');
        table.text('temperament');
        table.text('allergies');
        table.text('loud_noises');
        table.boolean('treats');
        table.text('feeding');
        table.text('img_url');
        table.timestamps(true, true);
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('catsOrOtherPets');
  };
  