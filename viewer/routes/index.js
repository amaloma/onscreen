var express = require('express');
var router = express.Router();
var fs = require('fs');
const os = require('os');

router.get('/system_info', function(req, res, next) { 
  var loadavg = os.loadavg()
  var uptime = os.uptime()
  var freemem = os.freemem()
  var totalmem = os.totalmem()
  var conf = {};
  conf.title = 'ONScreen'
  conf.loadavg = Math.round(loadavg[0] * 10)  
  conf.free_mem = Math.round(freemem/1024/1024)
  conf.total_mem = Math.round(totalmem/1024/1024)
  conf.uptime = Math.round(uptime/60/60/24)

  const exec = require('child_process').exec;
  exec('tvservice -s', function(error, stdout, stderr) {
    conf.display_info = stdout
    exec("df -h | tr -s ' ' '\t' | grep root | cut -f3-4", function(error, stdout, stderr) {
      conf.free_space = stdout.split('\t').join(" of ")
      exec("sudo systemctl status onscreen-viewer.service -n 20", function(error, stdout, stderr) {
        conf.viewlog = stdout.split('\n')
        res.render('system_info', conf ); 
      });
    });
  });
  
});

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
