const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.get('http://api.reviewsmaker.com/yelp/?url=https://www.yelp.com/biz/brooklyn-bark-brooklyn-3?osq=chicha&api_key=4b3d3d92-27f4-4eaa-bb8b-281cb8aa3860&rating=5', (err, res, body) => {
    if (err || response.statusCode !== 200) {
      return res.sendStatus(500);
    }
    res.render('index', {title: 'main page', reviews: JSON.parse(body)})
  });
  
});

//put reviews in here
module.exports = router;
