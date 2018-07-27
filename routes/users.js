const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const passport = require('passport');
const knex = require('../db/knex');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get the user profile
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', {
    user: req.user,
    userProfile: JSON.stringify(req.user, null, '  ')
  });
});

//add a user
router.post('/', function(req, res, next) {
  const {
   profile,
   accessToken
  } = req.body;
  knex('users').insert({
    display_name: profile.name,
    user_id: profile.sub,
    access_token
  })
  .then(() => {
    res.redirect('/users'); 
  })
  .catch(err => {
    next(err);
  })  
  console.log(profile);
})

//get a user and pets

router.get('/:id', (req, res, next) => {
  knex('users')
  .where('id', req.params.id)
  .first()
  .then(user => {
    knex('dogs')
    .orderBy('id')
    .where('user_id', req.params.id)
    .then(dogs => {
      res.render('user', {
        user,
        dogs
      })
    })
  })
})

//add a pet
router.post('/:id', (req, res, next) => {
  const user_id = req.params.id;
  const {
    name,
    medication,
    special_needs,

    
  } = req.body;
  knex('dogs')
  .insert({

  })
})

module.exports = router;
