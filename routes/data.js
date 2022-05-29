var express = require('express');
var router = express.Router();
var d3 = require('d3-sparql');
var { SparqlEndpointFetcher } = require('fetch-sparql-endpoint');
var { SparqlJsonParser } = require('sparqljson-parse');
const myFetcher = new SparqlEndpointFetcher;
const myParser = new SparqlJsonParser;

/* GET home page. */
router.get('/', async function(req, res, next) {   
    let query = `
    PREFIX d: <http://semanticf1web.com/data#>
    PREFIX dsc: <http://semanticf1web.com/description#>

    SELECT ?team ?name ?country ?birthdate ?age ?instagram
    WHERE {
        ?x  dsc:team  ?team;
            dsc:name  ?name;
            dsc:country ?country;
            dsc:birthdate  ?birthdate;
            dsc:age  ?age;
            dsc:instagram  ?instagram.
    }`;
    let sparqlEndpoint = 'http://localhost:3030/f1driverdata/sparql';

    let result = await d3.sparql(sparqlEndpoint, query);
    let data = JSON.stringify(result);
    
    return res.status(200).render('test', {drivers: result});
});


module.exports = router;