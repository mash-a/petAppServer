const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

//yelp
require('dotenv').config();
const yelpClient = require('./clients/yelp');
const bkbark = process.env.BKBARK_ID; //the yelp ID for bkbark
const redirect_uri = 'https://bkbarkapp.herokuapp.com/api/petApp/callback';

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
  }),
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
  audience: 'ttps://bkbarkapp.herokuapp.com/api/petApp',
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithms: ['RS256']

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('x-powered-by')
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use('/api/petApp', indexRouter);
app.use('/api/petApp/users', checkJwt, usersRouter);

yelpClient.reviews(bkbark)
  .then(response => {
    //console.log(response.jsonBody);
  })
  .catch(e => {
    console.log(e);
  });

// app.get('/api/petApp/public', function(req, res) {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });

// app.get('/api/petApp/private', checkJwt, function(req, res) {
//   res.json({
//     message: `${req.user.azp}`
//   });
// });

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
