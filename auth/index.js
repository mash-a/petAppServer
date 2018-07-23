const express = require('express');
const router = express.Router();
const Auth0Strategy = require('passport-auth0').Strategy;
const passport = require('passport');
// const jwt = require('jsonwebtoken');

const env = {
    AUTH0_DOMAIN: process.env.AUTH_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    AUTH0_CALLBACK_URL: 'http://localhost:3004/callback',
  }

const strategy = new Auth0Strategy({
    domain: env.AUTH0_DOMAIN,
    clientID: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    callbackURL: env.AUTH0_CALLBACK_URL,
}, (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
    }
);

//done is a verify callback - the purpose of a verify callback is to find the user that possesses a set of credentials.

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//session login 
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: 'http://localhost:3004/api/petApp',
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
    '/api/petApp',
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