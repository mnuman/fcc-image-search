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
    // project query to only retrieve term & when, reverse sorted by date, limited to 10 results and
    // push the result set back as the answer.
      db.collection('searches').find({}, { _id:0, term:1, when:1}).sort({ when: -1 }).limit(10).toArray( (err,searches) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'application/json');  // barf back JSON to client
        res.send(JSON.stringify(searches));
    });
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