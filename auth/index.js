const express = require('express');
const router = express.Router();
const Auth0Strategy = require('passport-auth0');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: 'http:localhost:3004/callback'
  }

const newAuthStrategy = new Auth0Strategy({
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: `http://${env.AUTH0_DOMAIN}/userinfo`,
    responseType: 'code',
    scope: 'openid profile',
})

passport.use(newAuthStrategy, (accessToken, refreshToken, profile, callback) => {
    const authUser = {
        authId = profile.id
    }
})