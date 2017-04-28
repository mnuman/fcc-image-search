'use strict';
var path = require('path');
module.exports = function(app, db) {
  // handle the non-query to show how to use this API
  app.get('/', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname + '/usage.html'));
  });

  app.get('/api/latest/imagesearch', (req, res) => {
    console.log('Handle stuff related to retrieving the last 10 results here ...');
    res.send('Retrieved previous queries for you');
  });

  app.get('/api/imagesearch/:keywords(*)', (req, res) => {
    // req.params.keywords contains the keywords for the request
    // req.query.<param_name> contains the parameters, if any.
    console.log('Handle stuff related to executing the actual query here ...');

    var searches = db.collection('searches');
    var currentSearch = {
      term: req.params.keywords,
      when: new Date().toJSON()
    };

    searches.insert(currentSearch, (err, data) => {
      if (err) throw err;
      console.log('Just wrote document into MongoDB: ' + JSON.stringify(currentSearch));
    });
    res.send('Executed some daft image search for ya!');
  });
};