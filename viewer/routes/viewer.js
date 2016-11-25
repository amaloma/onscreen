var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('viewer', { title: 'ONScreen' });
});

router.get('/splash_page', function(req, res, next) {
  var dataObj = {};
  dataObj. title = 'ONScreen';
  dataObj.ip_lookup = 1;
  dataObj.url = '192.168.1.11'
  res.render('splash_page', dataObj);
});

module.exports = router;
