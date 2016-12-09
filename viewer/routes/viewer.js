var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var ip = '192.168.1.11'
  var port = '3000'
  res.render('viewer', { title: 'ONScreen', url: 'http://'+ip+':'+port });
});

router.get('/black', function(req, res, next) {
  res.render('black', { title: 'ONScreen' });
});

router.get('/splash_page', function(req, res, next) {
  var dataObj = {};
  dataObj. title = 'ONScreen';
  dataObj.ip_lookup = 1;
  dataObj.url = '192.168.1.11'
  res.render('splash_page', dataObj);
});

module.exports = router;
