var express = require('express');
var router = express.Router();
var { SparqlEndpointFetcher } = require('fetch-sparql-endpoint');
var { SparqlJsonParser } = require('sparqljson-parse');
const myFetcher = new SparqlEndpointFetcher;
const myParser = new SparqlJsonParser;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let dataFetch = await myFetcher.fetchBindings('http://localhost:3030/test_dataset/sparql', 'PREFIX d: <http://aghniyaabdurrahman.com/data#> PREFIX dsc: <http://aghniyaabdurrahman.com/description#>   SELECT ?friend ?name ?birthPlace ?contact ?email  WHERE {     ?x  dsc:friend  ?friend;         dsc:name  ?name;         dsc:birthPlace  ?birthPlace;         dsc:contact  ?contact;         dsc:email  ?email.     }');
    dataFetch.on('data', (bindings) => {
        let result = myParser.parseJsonBindings(bindings);
        return res.json(result);
    });
    
    //res.send(dataFetch.data);
});
  
  module.exports = router;