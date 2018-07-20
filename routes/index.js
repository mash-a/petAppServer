const express = require('express');
const router = express.Router();
const passport = require('passport');

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: 'http:localhost:3004/callback'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//session login
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: `http://${env.AUTH0_DOMAIN}/userinfo`,
    responseType: 'code',
    scope: 'openid profile'
  }),
  function(req, res) {
    res.redirect('/');
  }
 );

 //session logout
 router.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/');
 });

 //final stage of authentication and redirect to /user
 router.get(
   '/callback',
   passport.authenticate('auth0', {
     failureRedirect: '/'
   }),
   (req, res) => {
     res.redirect(req.session.returnTo || '/user');
   }
 );

 router.get('/failure', function(req, res) {
  var error = req.flash("error");
  var error_description = req.flash("error_description");
  req.logout();
  res.render('failure', {
    error: error[0],
    error_description: error_description[0],
  });
});

module.exports = router;
