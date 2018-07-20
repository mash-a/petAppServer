const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const session = require('express-session');
const yelpClient = require('./clients/yelp');
const bkbark = 'HCgIpugr8ZUNnJv8XvDFEA'; //the yelp ID for bkbark
require('dotenv').config();
const yelpFiveStars = process.env.FIVE_RATING_REVIEWS;
const redirect_uri = 'http://localhost:3004/callback';
const jwtAuthz = require('express-jwt-authz');
const passport = require('passport');
const auth0Strategy = require('passport-auth0');
const flash = require('connect-flash')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
let randomURL = 'http://api.reviewsmaker.com/yelp/?url=https://www.yelp.com/biz/brooklyn-bark-brooklyn-3?osq=chicha&api_key=4b3d3d92-27f4-4eaa-bb8b-281cb8aa3860&rating=5'

// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//       cache: true,
//       rateLimit: true,
//       jwksRequestsPerMinute: 5,
//       jwksUri: "https://mash-a.auth0.com/.well-known/jwks.json"
//   }),
//   audience: 'http://localhost:3004/api/petApp',
//   issuer: "https://mash-a.auth0.com/",
//   algorithms: ['RS256']
// });

const strategy = new auth0Strategy(
  {
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: ' http://localhost:3004/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
  }
);

passport.use(strategy);

//this section can be used to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//
app.disable('x-powered-by')
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.get('/api/petApp', (req, res, next) => {
  res.json({ randomURL })
})

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Handle auth failure error messages
app.use(function(req, res, next) {
  if (req && req.query && req.query.error) {
    req.flash("error", req.query.error);
  }
  if (req && req.query && req.query.error_description) {
    req.flash("error_description", req.query.error_description);
  }
  next();
 });

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});


yelpClient.reviews(bkbark)
  .then(response => {
    console.log(response.jsonBody.total);
  })
  .catch(e => {
    console.log(e);
  });

// app.get(yelpFiveStars, (req, res, next)
//   .then(res => {
//     console.log(res.json)
//   })


// app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

// app.post('/api/petApp/upload', jwtCheck, jwtAuthz(['batch:upload']), (req, res) => {
//   let user = req.body;
//   console.log(user)
//   res.status(201).send(user);
// })














// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
