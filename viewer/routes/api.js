var express = require('express');
var router = express.Router();

var nedb = require('nedb')
datastore = new nedb({ filename: "viewer.db",  autoload: true });

router.delete('/assets/:id', function(req, res, next) {
  datastore.remove({asset_id:req.params.id}, function (err, numRemove) {
    res.send('ok');
  });   
});

router.put('/assets/:id', function(req, res, next) {
  var doc = JSON.parse(req.body.model);
  var id = doc._id
  doc.updateDate = new Date() 
  delete(doc._id)
  datastore.update({asset_id:req.params.id}, {$set: doc}, {}, function (err, numReplaced) {
    doc._id = id
    res.send(doc);
  });   
});

router.get('/assets', function(req, res, next) {
  datastore.find({}, function (err, docs) {
    res.send(docs);
  });   
});

router.post('/assets/order', function(req, res, next) {
  var ids = req.body.ids.split(",");
  // console.log("ids",ids,ids.length)
  if(ids.length == 0 || ids[0]=='') { 
    res.send('null') 
    return
  };
  var n=0
  for(var i in ids) {
    datastore.update({asset_id:ids[i]}, {$set: {play_order:i}}, {}, function (err, numReplaced) {
      if(++n >= ids.length) res.send('ok');
    }); 
  }
});

router.post('/assets', function(req, res, next) {
  var doc = JSON.parse(req.body.model);
  // var doc = req.body.model;
  doc.updateDate = new Date() 
  doc.asset_id = (Date.now().toString(36) 
    + Math.random().toString(36).substr(2, 5)).toUpperCase()
  // if (!('_id' in doc)) {
    doc.createDate = new Date() ,    
    datastore.insert(doc, function (err, newDocs) {
      res.send(newDocs);
    }); 
  // } else {
  //   var id = doc._id;
  //   delete(doc._id)
  //   datastore.update({_id:id}, {$set: doc}, {}, function (err, numReplaced) {
  //     res.send(numReplaced);
  //   });   
  // }
  
});

/* GET home page. ========================= */
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