exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('profilePic');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.string('profilePic').notNullable();
    });
};