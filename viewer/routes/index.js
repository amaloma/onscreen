var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ONScreen'
    , default_duration: 10
    , use_24_hour_clock: 1 
  });
});

module.exports = router;
