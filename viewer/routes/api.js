var express = require('express');
var router = express.Router();

var nedb = require('nedb')
datastore = new nedb({ filename: "viewer.db",  autoload: true });

/* GET home page. */
router.get('/', function(req, res, next) {
  var resData = {}
  datastore.find({}, function (err, docs) {
    resData.err = 0; 
    resData.msg = 'GET OK';
    if(err) { 
      resData.err = 1; 
      resData.msg = err;
    }
    resData.docs = docs;
    res.send(resData);
  });   
});

router.get('/:id', function(req, res, next) {
  var resData = {}
  datastore.find({_id:req.params.id}, function (err, docs) {
    resData.err = 0; 
    resData.msg = 'GET OK';
    if(err) { 
      resData.err = 11; 
      resData.msg = err;
    }
    resData.docs = docs;
    res.send(resData);
  });   
});

router.post('/', function(req, res, next) {
  var resData = {}
  var doc = req.body;  
  doc.createDate = new Date() ,
  doc.updateDate = new Date() ,

  datastore.insert(doc, function (err, newDocs) {
    resData.err = 0; 
    resData.msg = 'POST OK';
    if(err) { 
      resData.err = 2; 
      resData.msg = err;
    }
    resData.docs = newDocs;
    res.send(resData);
  });   
});

router.put('/:id', function(req, res, next) {
  var resData = {}
  var doc = req.body;
  doc.updateDate = new Date()
  //console.log('doc:', doc)
  datastore.update({_id:req.params.id}, {$set: doc}, {}, function (err, numReplaced) {
    resData.err = 0; 
    resData.msg = 'PUT OK';
    if(err) { 
      resData.err = 3; 
      resData.msg = err;
    }
    resData.docs = numReplaced;
    res.send(resData);
  });   
});

router.delete('/:id', function(req, res, next) {
  var resData = {}
  datastore.remove({_id:req.params.id}, function (err, numRemove) {
    resData.err = 0; 
    resData.msg = 'DELETE OK';
    if(err) { 
      resData.err = 4; 
      resData.msg = err;
    }
    resData.docs = numRemove;
    res.send(resData);
  });   
});

module.exports = router;