exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('email');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.string('email').unique().notNullable();
    });
};