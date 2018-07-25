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
const yelpClient = require('./clients/yelp');
const bkbark = 'HCgIpugr8ZUNnJv8XvDFEA'; //the yelp ID for bkbark
require('dotenv').config();
const yelpFiveStars = process.env.FIVE_RATING_REVIEWS;
const redirect_uri = 'http://localhost:3004/callback';


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
let randomURL = 'http://api.reviewsmaker.com/yelp/?url=https://www.yelp.com/biz/brooklyn-bark-brooklyn-3?osq=chicha&api_key=4b3d3d92-27f4-4eaa-bb8b-281cb8aa3860&rating=5'

const app = express();

const checkJwt = jwt({

  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://mash-a.auth0.com/.well-known/jwks.json`
  }),
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
  audience: 'http://localhost:3004/api/petApp',
  issuer: `https://mash-a.auth0.com/`,
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

app.get('/api/petApp', (req, res, next) => {
  res.json({ randomURL })
})

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

yelpClient.reviews(bkbark)
  .then(response => {
    //console.log(response.jsonBody);
  })
  .catch(e => {
    console.log(e);
  });

// app.get(yelpFiveStars, (req, res, next)
//   .then(res => {
//     console.log(res.json)
//   })

// app.post('/api/petApp/upload', jwtCheck, jwtAuthz(['batch:upload']), (req, res) => {
//   let user = req.body;
//   console.log(user)
//   res.status(201).send(user);
// })

app.get('/api/petApp/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

app.get('/api/petApp/private', checkJwt, function(req, res) {
  res.json({
    message: `${req.user.azp}`
  });
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
