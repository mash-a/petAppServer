
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {display_name: 'bob', access_token: 'safjasf', user_id: 'dfsgd', neighborhood: 'Windsor Terrace'},
        {display_name: 'lady', access_token: '464yfds', user_id: 'geyrjhgks', neighborhood: 'Prospect Park'},
        {display_name: 'fil', access_token: 'afhsiuryw', user_id: 'rw687539jdksfd', neighborhood: 'Williamsburg'}
      ]);
    });
};
