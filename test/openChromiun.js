var exec = require('child_process').exec

exec('chromium-browser www.google.com' , function(err) {
if(err){ //process error
console.log("error:",err)
}

else{ console.log("success open")
}

})
