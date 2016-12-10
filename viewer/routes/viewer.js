var express = require('express');
var router = express.Router();
var fs = require('fs');
var os = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {
  var conf = JSON.parse(fs.readFileSync('onscreen.conf.json', 'utf8'));
  var dataObj = {};
  dataObj.protocal = 'http'
  dataObj.ip = '192.168.1.11'
  dataObj.port = '3000'
  dataObj.title = 'ONScreen';

  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        // console.log(ifname, iface.address);
        dataObj.ip = iface.address
        dataObj.url = dataObj.protocal+'://'+dataObj.ip+':'+dataObj.port
        res.render('viewer', dataObj);
      }
      ++alias;
    });
  });  
});

router.get('/black', function(req, res, next) {
  res.render('black', { title: 'ONScreen' });
});

router.get('/splash_page', function(req, res, next) {
  var conf = JSON.parse(fs.readFileSync('onscreen.conf.json', 'utf8'));
  var dataObj = {};
  dataObj.protocal = 'http'
  dataObj.ip = '192.168.1.11'
  dataObj.port = '3000'
  dataObj.title = 'ONScreen';

  var ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        // console.log(ifname, iface.address);
        dataObj.ip_lookup = 1;
        dataObj.ip = iface.address
        dataObj.url = dataObj.protocal+'://'+dataObj.ip+':'+dataObj.port
        res.render('splash_page', dataObj);
      }
      ++alias;
    });
  });  

});

module.exports = router;
