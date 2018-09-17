var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var dateFormat = require('dateformat');

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
  url = "https://napi.busbud.com/x-departures/dr5reg/f25dvk/2018-11-09";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    var response = "hola";
    if (xhr.readyState === 4) {
      console.log("error");
      if (xhr.status === 200 || xhr.status === 304) {
        var response = JSON.parse(xhr.responseText);

        //Provide client side "results"
        var results = {
          departure: [],
          arrival: [],
          diffDays: [],
          diffTime: [],
          origin: [],
          destination: []
        };

        response.departures.forEach(function(item_specific) {

          //Departure time
          var departure = dateFormat(item_specific.departure_time, "UTC:h:MM  TT");
          results.departure.push(departure);

          // Arrival time
          var arrival = dateFormat(item_specific.arrival_time, "UTC:h:MM  TT");
          results.arrival.push(arrival);

          // Days difference
          var date1 = new Date(dateFormat(item_specific.departure_time,"yyyy-mm-dd"));
          var date2 = new Date(dateFormat(item_specific.arrival_time,"yyyy-mm-dd"));
          var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
          results.diffDays.push(diffDays > 0 ? diffDays : "");

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
        });
        console.log(results);
        res.render('results', { title: "Busbud-Results", results: results });
      }
    }

  };
  xhr.open("GET", url, true);
  xhr.setRequestHeader( 'Content-Type',   'application/json' );
  xhr.setRequestHeader( 'Accept', 'application/vnd.busbud+json; version=2; profile=https://schema.busbud.com/v2/' );
  xhr.setRequestHeader("X-Busbud-Token", "PARTNER_AHm3M6clSAOoyJg4KyCg7w");
  xhr.send();
}
