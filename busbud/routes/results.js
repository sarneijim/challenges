var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var dateFormat = require('dateformat');
var cities = {
  "New York": "dr5reg",
  "Montreal": "f25dvk"
}

/* GET results page. */
router.get('/', function(req, res, next) {

  // Params
  origin = req.query.origin;
  destination = req.query.destination;
  departure = req.query.departure;
  passengers = req.query.passengers;

  search(req.query, res);

});

module.exports = router;

function search(params, res) {
  console.log(params);
  originCode = cities [params.origin];
  destinationCode = cities [params.destination];
  date = params.departure.split("-").reverse().join("-");
  url = "https://napi.busbud.com/x-departures/" + originCode + "/" + destinationCode + "/" + date;

  var passengers = parseInt(params.adults) + parseInt(params.children) + parseInt(params.seniors);
  var adults = "adult=" + params.adults;
  var children = "child=" + params.children;
  var seniors = "senior=" + params.seniors;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 304) {
        var response = JSON.parse(xhr.responseText);
        //Provide client side "results"
        var results = {
          departure: [],
          arrival: [],
          diffDays: [],
          diffTime: [],
          origin: [],
          destination: [],
          price: []
        };

        response.departures.forEach(function(item_specific) {

          //Departure time
          var departure = dateFormat(item_specific.departure_time, "UTC:hh:MM  TT");
          results.departure.push(departure);

          // Arrival time
          var arrival = dateFormat(item_specific.arrival_time, "UTC:hh:MM  TT");
          results.arrival.push(arrival);

          // Days difference
          var date1 = new Date(dateFormat(item_specific.departure_time,"yyyy-mm-dd"));
          var date2 = new Date(dateFormat(item_specific.arrival_time,"yyyy-mm-dd"));
          var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
          results.diffDays.push(diffDays > 0 ? "+" + diffDays : "");

          //Duration trip
          var time1 = new Date(item_specific.departure_time);
          var time2 = new Date(item_specific.arrival_time);
          var diffHour = parseInt((time2 - time1) / (1000 * 60 * 60)) ;
          var diffMin = ((parseInt((time2 - time1) / (1000 * 60))) - diffHour * 60 );
          var diffTime = diffHour + "h " + diffMin + "m";
          results.diffTime.push(diffTime);

          //Name origin and destination (using service id location)
          var origin = "undefined";
          var destination = "undefined";
          response.locations.forEach(function(item_generic) {
            if (item_generic.id == item_specific.origin_location_id){
              origin = item_generic.name
            }
            if (item_generic.id == item_specific.destination_location_id){
              destination = item_generic.name
            }
          });
          results.origin.push(origin);
          results.destination.push(destination);

          //Price
          console.log(item_specific);
          price = item_specific.prices.total / 100 + "CAD";
          results.price.push(price);
        });
        res.render('results', {
          title: "Busbud-Results",
          results: results,
          origin: params.origin,
          destination: params.destination,
          date: params.departure,
          passengers: passengers
        });
      }
    }

  };
  xhr.open("GET", url+"?"+ adults + "&" + children + "&" + seniors+ "&child_ages=6&senior_ages=65");
  xhr.setRequestHeader( 'Content-Type',   'application/json' );
  xhr.setRequestHeader( 'Accept', 'application/vnd.busbud+json; version=2; profile=https://schema.busbud.com/v2/' );
  xhr.setRequestHeader("X-Busbud-Token", "PARTNER_AHm3M6clSAOoyJg4KyCg7w");
  xhr.send();
}






