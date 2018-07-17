require('dotenv').config();
let connectionString = process.env.CONNECTION_STRING;

module.exports = {
    development: {
        client: 'pg',
        connection: connectionString,
        migrations: {
            directory: __dirname + '/db/migrations',
          },
        seeds: {
            directory: __dirname + '/db/seeds',
          },
      },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL || 'postgres://postgres:root@localhost/brooklynBark',
        migrations: {
            directory: __dirname + '/db/migrations',
          },
        seeds: {
            directory: __dirname + '/db/seeds/production',
          },
      },
  };