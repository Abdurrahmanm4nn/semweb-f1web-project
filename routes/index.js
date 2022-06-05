var express = require('express');
var router = express.Router();
var d3 = require('d3-sparql');
let sparqlEndpoint = 'http://localhost:3030/f1data/sparql';

function getAllTeamsQuery(){
    let query = `
        PREFIX d: <http://semanticf1web.com/data#>
        PREFIX dsc: <http://semanticf1web.com/description#>

        SELECT ?teamlogo ?name ?engine
        WHERE {
            ?x  dsc:type "Team";
                dsc:teamlogo ?teamlogo;
                dsc:name  ?name;
                dsc:engine  ?engine;
        }`;

    return query;
}

/* GET home page. */
router.get('/', async function(req, res, next) {   
    let teamsSparqlQuery  = getAllTeamsQuery();

    let teamResult = await d3.sparql(sparqlEndpoint, teamsSparqlQuery);
    
    return res.status(200).render('index', {teams: teamResult});
});


module.exports = router;
