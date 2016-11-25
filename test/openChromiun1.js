const spawn = require('child_process').spawn;
const chromium = spawn('chromium-browser', ['www.kaidee.com']);

chromium.stdout.on('data', function(data) {
  console.log('stdout:', data);
});

chromium.stderr.on('data', function(data) {
  console.log('stderr:', data);
});

chromium.on('close', function(code) {
  console.log('child process exited with code', code);
});
