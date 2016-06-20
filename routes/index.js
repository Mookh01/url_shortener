var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var config = require('../config');
//This gets our connection to our local MongoDB database up and running.
var mLab = "mongodb://"+ config.db.host + '/' + config.db.name;
//The variable MongoClient is used to host MongoDB's connect command.
var MongoClient = mongodb.MongoClient

var shortid = require('shortid');




/* GET home page. */
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var validUrl = require('valid-url');
//Need to build out route
router.get('/', function(req, res, next) {
  var local = req.get('host');
  res.render('index', { host: local });
});

//Creating new links
//The (*) piece in our :url(*) parameter will allow us to pass in properly formatted links.
// Without it, Express will get confused with the forward slashes in URLs and
//think they’re additional parts of the route.
router.get('/new/:url(*)', function (req, res, next) {
//res.send  --> sends whats in the ().
//The (req.params.url) is telling the browser to put in whatever is after..  /new/
  // res.send(req.params.url);

//we would replace the res.send(req.params.url) with the following:
//This connects the local database and prints a message.
MongoClient.connect(mLab, function (err, db) {
  if(err){
    console.log("Unable to connect to server", err);
  } else {
    console.log("Connected to server");
    //collection: sets up our collection and make it a bit easier to access
    //params sets to our url parameter
    var collection = db.collection('links');
    var params = req.params.url;
    //making it a bit more dynamic so we don't have to update the string
    //when we push it to deployment.
 var local = req.get('host') + "/";
    //newLink imports a link to the database and returns a short link
    //newLink will accept a callback that will close the database connection once its run.
    var newLink = function (db, callback) {
      //This will create a new object with our passed-thru parameters set to the url key
      //and "test" set to the short key.then it pushes to the database.
      // var insertLink = {url: params, short: "test" };
      // collection.insert([insertLink]);
      // res.send(params);

//this collection.findOne queries our database before we drop a link into it to check if it exists.
// we are looking for the url and we're only returning the short code.
      collection.findOne({ "url": params }, {short: 1, _id: 0}, function (err, doc){
        if( doc != null){
          res.json({ original_url: params, meanurl: local + doc.short });
        } else {
          if(validUrl.isUri(params)) {
        //if URL is valid, do this
        //this generates a short code.
        //this creates a new object and inserts it into the collection as a new document.
        //we then push JSON to our browser
        var shortCode = shortid.generate();
        var newUrl = { url: params, short: shortCode };
        collection.insert([newUrl]);
        res.json({ original_url: params, meanurl: local + shortCode
      });
      } else {
        // if URL is invalid, we output an error
        res.json({ error: "Wrong url format, make sure you have a valid protocol (http://) and a real site."});
      };
    };
  });
};
    newLink(db, function() {
      db.close();
    });
  };

});
}); //router.get

//THis is another router that connects to our database
//Most of it is similar to the last router
router.get('/:short', function (req, res, next) {

  MongoClient.connect(mLab, function (err, db) {
    if (err) {
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")

      var collection = db.collection('links');
      var params = req.params.short;
//We take the parameter that has passed through and find it in our collection.
      var findLink = function (db, callback) {
//we use the .findOne query since the short codes are unique values.
//the query is limited to only returning the url field.
//after query has run we pass in a function. If a document is found,
//the function will return it.
        collection.findOne({"short": params }, {url: 1, _id: 0 }, function (err, doc) {
          if (doc != null) {
//Once documents returned we use res.redirect() to redirect browser to the value
//of the returned key/value pair.
            res.redirect(doc.url);
          } else {
            //if no document is found we will JSON error
            res.json({error: "No corresponding shortlink found in the database."});
          };
        });
      };

      findLink(db, function () {
        db.close();
      });

    };
  });
});

module.exports = router;
