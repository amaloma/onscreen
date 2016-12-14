var express = require('express');
var router = express.Router();
var fs = require('fs');
const os = require('os');

const dhcpcd = "# A sample configuration for dhcpcd. \n \
# See dhcpcd.conf(5) for details. \n \
 \n \
# Allow users of this group to interact with dhcpcd via the control socket. \n \
#controlgroup wheel \n \
 \n \
# Inform the DHCP server of our hostname for DDNS. \n \
hostname \n \
 \n \
# Use the hardware address of the interface for the Client ID. \n \
clientid \n \
# or \n \
# Use the same DUID + IAID as set in DHCPv6 for DHCPv4 ClientID as per RFC4361. \n \
#duid \n \
 \n \
# Persist interface configuration when dhcpcd exits. \n \
persistent \n \
 \n \
# Rapid commit support. \n \
# Safe to enable by default because it requires the equivalent option set \n \
# on the server to actually work. \n \
option rapid_commit \n \
 \n \
# A list of options to request from the DHCP server. \n \
option domain_name_servers, domain_name, domain_search, host_name \n \
option classless_static_routes \n \
# Most distributions have NTP support. \n \
option ntp_servers \n \
# Respect the network MTU. \n \
# Some interface drivers reset when changing the MTU so disabled by default. \n \
#option interface_mtu \n \
 \n \
# A ServerID is required by RFC2131. \n \
require dhcp_server_identifier \n \
 \n \
# Generate Stable Private IPv6 Addresses instead of hardware based ones \n \
slaac private \n \
 \n \
# A hook script is provided to lookup the hostname if not set by the DHCP \n \
# server, but it should not be run by default. \n \
nohook lookup-hostname \n "


const static_ip = "# Custom static IP address for eth0. \n \
interface eth0 \n "
// static ip_address=192.168.1.11/24 \n \
// static routers=192.168.1.1 \n \
// static domain_name_servers=192.168.1.1 \n " 

router.post('/ip_settings', function(req, res, next) { 
  var exec = require('child_process').exec; 
  console.log("req.body ->",req.body)
  var comm
  if(req.body.dhcp_client == 'on') {
    comm = "sudo echo '"+dhcpcd+"' > /etc/dhcpcd.conf"
  } else {
    comm = "sudo echo '"
    + dhcpcd
    + static_ip
    + "static ip_address=" + req.body.now_ip + '\n'
    + "static routers=" + req.body.routers + '\n'
    + "static domain_name_servers=" + req.body.dns + '\n'
    + "' > /etc/dhcpcd.conf"    
  }
  console.log("comm ->",comm)
  exec(comm, function(error, stdout, stderr) {
    console.log("error ->",error)
    res.send('NOW REBOOT'); 
    setTimeout(function(){
      exec("sudo reboot", function(error, stdout, stderr) {
        console.log("error ->",error)
        console.log("REBOOT !!")
      });
    }, 3000); 
  }); 
}); 

router.get('/ip_settings', function(req, res, next) {
  var exec = require('child_process').exec;
  var conf = {}
  // console.log("conf ->",conf)
  conf.title = 'ONScreen'
  exec("cat /etc/dhcpcd.conf | grep 'static ip_address'", function(error, stdout, stderr) {
    // console.log("stdout.length ->",stdout.length,stdout)
    if(stdout.length > 1) conf.dhcp_client = false 
    else conf.dhcp_client = true
    exec("ip a | grep 'global eth0' | tr -s ' ' '\t' | cut -f3", function(error, stdout, stderr) {
      conf.now_ip = stdout
      exec("ip route | grep default | tr -s ' ' '\t' | cut -f3", function(error, stdout, stderr) {
        conf.routers = stdout
        exec("cat /etc/resolv.conf | grep nameserver |  tr -s ' ' '\t' | cut -f2", function(error, stdout, stderr) {
          conf.dns = stdout
          res.render('ip_settings', conf );   
        });
      });
    });
  });
});

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
  conf.splash_page_delay = req.body.splash_page_delay;
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
