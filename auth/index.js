const express = require('express');
const router = express.Router();
const Auth0Strategy = require('passport-auth0').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const knex = require('../db/knex');

const env = {
    AUTH0_DOMAIN: process.env.AUTH_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET,
    AUTH0_CALLBACK_URL: 'http://localhost:3004/auth/callback',
  }

const strategy = new Auth0Strategy({
    domain: env.AUTH0_DOMAIN,
    clientID: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    callbackURL: env.AUTH0_CALLBACK_URL,
}, (accessToken, refreshToken, extraParams, profile, done) => {
    console.log(profile)
        const userAuth = {
            iD: profile.id
        };
       return knex('users')
            .where('userID', userAuth.iD)
            .first()
        .then(user => {
            if (user) {
            //update user in db 
            return db('users')
                .where('userID', userAuth.iD)
                .update(userAuth, '*');
      
            } else {
            //insert user into db. knex syntax?
            return db('users')
            .insert(userAuth, '*');
            }
        })
        .then(user => {
            callback(null, user[0]);
        }).catch(error => {
            callback(error);
        });
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

//router.get('/auth', passport.authenticate('auth0', {scope: ['openid', 'profile', 'email'], authType: 'rerequest'}));

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
  router.get('/auth/callback',(req, res, next) => {
    passport.authenticate('auth0', (err, user) => {
        if(err) {
            return next(err);
        } else {
            const payload = {
                id: user.id
            };
            jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: '1d'
            }, (err, token) => {
                if(err){
                    next(err)
                } else {
                    console.log(token)
                    res.cookie('token', token);
                    res.json({message:'true'})
                    //res.redirect('/login.html')
                }
            });
        }
      })(req, res, next);
  });
   
 
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