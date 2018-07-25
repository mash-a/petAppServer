const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const passport = require('passport');

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

router.post('/', function(req, res, next) {
  const {
   profile,
   accessToken
  } = req.body;
  
  console.log(accessToken, profile);
})

module.exports = router;
