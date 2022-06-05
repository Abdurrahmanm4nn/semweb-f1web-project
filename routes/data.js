var express = require('express');
var router = express.Router();
var d3 = require('d3-sparql');
let sparqlEndpoint = 'http://localhost:3030/f1data/sparql';

function getAllDriverQuery(){
    let query = `
        PREFIX d: <http://semanticf1web.com/data#>
        PREFIX dsc: <http://semanticf1web.com/description#>

        SELECT ?team ?name ?photoURL ?country ?birthdate ?age ?instagram
        WHERE {
            ?x  dsc:type "Driver";
                dsc:team  ?team;
                dsc:photoURL ?photoURL;
                dsc:name  ?name;
                dsc:country ?country;
                dsc:birthdate  ?birthdate;
                dsc:age  ?age;
                dsc:instagram  ?instagram.
        }`;

    return query;
}

function searchDriverQuery(filters){
    const { search, country, team } = filters;
    let query = `
        PREFIX d: <http://semanticf1web.com/data#>
        PREFIX dsc: <http://semanticf1web.com/description#>
        SELECT ?team ?name ?photoURL ?country ?birthdate ?age ?instagram
        WHERE {
            ?x  dsc:type "Driver";
                dsc:team  ?team;
                dsc:photoURL ?photoURL;
                dsc:name  ?name;
                dsc:country ?country;
                dsc:birthdate  ?birthdate;
                dsc:age  ?age;
                dsc:instagram  ?instagram.
            FILTER REGEX(?name, "${search ?? ''}", "i")
            FILTER REGEX(?team, "${team ?? ''}", "i")
            FILTER REGEX(?country, "${country ?? ''}", "i")
        }`;

    return query;
}

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
function getTeamQuery(name){
    let query = `
        PREFIX d: <http://semanticf1web.com/data#>
        PREFIX dsc: <http://semanticf1web.com/description#>

        SELECT ?teamlogo ?name ?engine
        WHERE {
            ?x  dsc:type "Team";
                dsc:teamlogo ?teamlogo;
                dsc:name  ?name;
                dsc:engine  ?engine;
            FILTER REGEX(?name, "${name ?? ''}", "i")
        }`;

    return query;
}

/* GET home page. */
router.get('/', async function(req, res, next) {   
    let teamsSparqlQuery  = getAllTeamsQuery();
    let usrQuery = req.query;

    let driverSparqlQuery;

    if(!usrQuery){
        driverSparqlQuery = getAllDriverQuery();
    } else {
        driverSparqlQuery = searchDriverQuery(usrQuery);
    }

    let driverResult = await d3.sparql(sparqlEndpoint, driverSparqlQuery);
    let teamResult = await d3.sparql(sparqlEndpoint, teamsSparqlQuery);
    
    return res.status(200).render('test', {teams: teamResult, drivers: driverResult});
});

router.get('/details/:search', async (req, res) => {
    let params = req.params;
    let query = searchDriverQuery(params);

    let result = await d3.sparql(sparqlEndpoint, query);
    
    return res.status(200).render('driverdetails', {drivers: result});
});

router.get('/teams/:name', async (req, res) => {
    let name = req.params.name;
    let teamsSparqlQuery  = getTeamQuery(name);
    let filter = {};

    filter.team = name;
    let driverSparqlQuery = searchDriverQuery(filter);

    let driverResult = await d3.sparql(sparqlEndpoint, driverSparqlQuery);
    let teamResult = await d3.sparql(sparqlEndpoint, teamsSparqlQuery);

    return res.status(200).render('teams', {teams: teamResult, drivers: driverResult});
});

module.exports = router;