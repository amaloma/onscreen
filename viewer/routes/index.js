var express = require('express');
var router = express.Router();

var fs = require('fs');

router.post('/settings', function(req, res, next) { 
  var conf = JSON.parse(fs.readFileSync('onscreen.conf.json', 'utf8'));

  if(req.body.use_24_hour_clock == 'on') conf.use_24_hour_clock = true;
  else conf.use_24_hour_clock = false;
  if(req.body.show_splash == 'on') conf.show_splash = true;
  else conf.show_splash = false;
  if(req.body.shuffle_playlist == 'on') conf.shuffle_playlist = true;
  else conf.shuffle_playlist = false;
  if(req.body.debug_logging == 'on') conf.debug_logging = true;
  else conf.debug_logging = false;
  conf.audio_output = req.body.audio_output;
  conf.default_duration = req.body.default_duration;
  conf.title = 'ONScreen'

  fs.writeFile('onscreen.conf.json', JSON.stringify(conf, null, 2));
  res.render('settings', conf );
});

router.get('/settings', function(req, res, next) {
  var conf = JSON.parse(fs.readFileSync('onscreen.conf.json', 'utf8'));
  // console.log("conf ->",conf)
  conf.title = 'ONScreen'
  res.render('settings', conf );
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var conf = JSON.parse(fs.readFileSync('onscreen.conf.json', 'utf8'));
  conf.title = 'ONScreen'
  res.render('index', conf );
});

module.exports = router;
