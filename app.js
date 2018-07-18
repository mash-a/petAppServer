const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const yelpClient = require('./clients/yelp');
const bkbark = 'HCgIpugr8ZUNnJv8XvDFEA';
require('dotenv').config();
const yelpFiveStars = process.env.FIVE_RATING_REVIEWS;
const redirect_uri = 'http://localhost:3004/callback';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('x-powered-by')
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let randomURL = 'http://api.reviewsmaker.com/yelp/?url=https://www.yelp.com/biz/brooklyn-bark-brooklyn-3?osq=chicha&api_key=4b3d3d92-27f4-4eaa-bb8b-281cb8aa3860&rating=5'

app.get('/api/petApp', (req, res, next) => {
  res.json({ randomURL   })
})


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

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://mash-a.auth0.com/.well-known/jwks.json"
  }),
  audience: 'http://localhost:3004/api/petApp',
  issuer: "https://mash-a.auth0.com/",
  algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});
















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
