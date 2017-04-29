'use strict';
var path = require('path');
var request = require('request');
const bingBaseUrl = 'https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=';

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

    var requestOptions = {
      url : bingBaseUrl + req.params.keywords + '&count=10' + ( (req.query.offset) ? '&offset=' + req.query.offset : ''),
      headers : {
        "Ocp-Apim-Subscription-Key" : process.env.BING_API_KEY
      }
    };

    var searches = db.collection('searches');
    var currentSearch = {
      term: req.params.keywords,
      when: new Date().toJSON()
    };

    searches.insert(currentSearch, (err, data) => {
      if (err) throw err;
      // console.log('Just wrote document into MongoDB: ' + JSON.stringify(currentSearch));
    });

    // now perform the actual request to Bing
    request(requestOptions, (error, response, body) => {
      if (error) throw error;
      var bingResponse = JSON.parse(body);
      var responseObject = {
        pageUrl : bingResponse.webSearchUrl,
        images : []
      };
      for (var i = 0; i < bingResponse.value.length; i++){
        responseObject.images.push({ altText : bingResponse.value[i].name,
          imageUrl: bingResponse.value[i].contentUrl
        });
      }
      // console.log('Sending back response:' + JSON.stringify(responseObject));
      res.send(responseObject);
    });
  });
};