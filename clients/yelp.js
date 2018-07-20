require('dotenv').config();
const yelp = require('yelp-fusion');

const searchRequest = {
    name: 'Brooklyn Bark',
    address1: '171 Clermont Ave',
    address2: 'Brooklyn, NY 11205',
    city: 'Brooklyn',
    state: 'NY',
    country: 'US'
  }
  
const client = yelp.client(process.env.YELP_API_KEY);

module.exports = client;