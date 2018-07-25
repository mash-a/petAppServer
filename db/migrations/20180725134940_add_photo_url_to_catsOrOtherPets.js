
exports.up = function(knex, Promise) {
    return knex.schema.table('catsOrOtherPets', table => {
        table.string('img url');
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('catsOrOtherPets', table => {
        table.dropColumn('img url');
    })
  };
  