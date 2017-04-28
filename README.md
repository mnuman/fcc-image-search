# fcc-image-search
Image search project

## Links
[App on Heroku](https://fcc-image-search-mn.herokuapp.com/)
[Heroky Remote](https://git.heroku.com/fcc-image-search-mn.git)

[Sample application](https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/lolcats%20funny?offset=10)
[Browse for recent searches])(https://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/)

### User Stories to be implemented:
- [ ] I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
- [ ] I can paginate through the responses by adding a ?offset=2 parameter to the URL.
- [ ] I can get a list of the most recently submitted search strings

### Routes
/api/imagesearch/lolcats%20funny?offset=10 Returns a JSON object including url, snippet, thumbnail, context

?offset=x paginates the results

/api/latest/imagesearch/

Lists recently submitted strings

### Development
- setting up MongoDB in c9 using the instruction from the [C9 Community]](https://community.c9.io/t/setting-up-mongodb/1717)
- Using the MongoDB client
- Setting environment variables in c9: https://stackoverflow.com/questions/25980154/how-do-the-environment-variables-work-within-cloud9, in this case: export DB_URL=mongodb://$IP:27017/imagesearches
- Bla
- 

#### Sorting results in MongoDB:
For sorting the documents descending on the date showing only the latest 10, use the following syntax: 
`db.searches.find().sort({ when: -1 }).limit(10)`

