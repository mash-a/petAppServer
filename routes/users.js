const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const passport = require('passport');
const knex = require('../db/knex');

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('users').then(users => res.json({users: users}))
});

// Get the user profile
router.get('/:id', function(req, res, next) {
  console.log(req.params)
  knex('users').where('id', req.params.id).then(user => res.json({user: user}))
});

//add a user
router.post('/', function(req, res, next) {
  //console.log(req.body)
  const {
   profile,
   accessToken
  } = req.body;
  knex('users').insert({
    display_name: profile.name,
    user_id: profile.sub,
    access_token: accessToken
  })  
  .then(() => {
    res.redirect('/users'); 
  })
  .catch(err => {
    console.error(err);
  })
})

//edit user 
router.patch('/:id', (req, res, next) => {
  // const {
  //   profile,
  //   accessToken
  //  } = req.body;
  knex('users')
  .update(req.body)
  .where('id', req.params.id)
  .then(() => {
    res.redirect('/users');
  })
  .catch(err => {
    console.error(err)
  })
})

//get a user and dogs

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

//get a cat or other pet

router.get('/:id', (req, res, next) => {
  knex('users')
  .where('id', req.params.id)
  .first()
  .then(user => {
    knex('catsOrOtherPets')
    .orderBy('id')
    .where('user_id', req.params.id)
    .then(catsOrOtherPets => {
      res.render('user', {
        user,
        catsOrOtherPets
      })
    })
  })
})

//add a dog
router.post('/:id', (req, res, next) => {
  const user_id = req.params.id;
  knex('dogs')
  .insert({
    name: req.body.name,
    medication: req.body.medication,
    special_needs: req.body.specialNeeds,
    walk_requirements: req.body.walkRequirements,
    birthday: req.body.birthday,
    temperament: req.body.temperament,
    allergies: req.body.allergies,
    loud_noises: req.body.loudNoises,
    treats: req.body.treats,
    other: req.body.other,
    feeding: req.body.feeding,
    img_url: req.body.imgUrl,
    user_id: user_id  
  })
  .then(() => {
    res.redirect(`/users/${id}`)
  })
  .catch(err => {
    next(err);
  })
})

//add a cat or other pet
router.post('/:id', (req, res, next) => {
  const user_id = req.params.id;
  knex('catsOrOtherPets')
  .insert({
    name: req.body.name,
    medication: req.body.medication,
    special_needs: req.body.specialNeeds,
    hiding_spots: req.body.hidingSpots,
    birthday: req.body.birthday,
    temperament: req.body.temperament,
    allergies: req.body.allergies,
    loud_noises: req.body.loudNoises,
    treats: req.body.treats,
    other: req.body.other,
    feeding: req.body.feeding,
    img_url: req.body.imgUrl,
    user_id: user_id  
  })
  .then(() => {
    res.redirect(`/users/${id}`)
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;
