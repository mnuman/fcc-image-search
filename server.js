'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongo = require('mongodb').MongoClient;
var router = require('./router');

// need to set a DB_URL to connect, format mongodb://username:password@host:port/database
mongo.connect( process.env.DB_URL, (err, db) => {
  if (err) throw err;
  console.log('We\'re connected to MONGO now ...');
  // push all other work to the router
  router(app, db);
});

// need to set port dynamically for Heroku ....
app.listen(port, function() {
  console.log('Image search app listening on port ', + port +'!');
})
