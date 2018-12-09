'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
let lat;
let long;

//Load env vars;
require('dotenv').config();

const PORT = process.env.PORT || 3000;

//app
const app = express();
app.use(cors());
app.get('/location', getLocation);

// Get Location data
  function getLocation (request, response) {
    return searchToLatLong(request.query.data)
    .then(locationData => {
      response.send(locationData)}
      )
  }

// Get weather data
app.get('/weather', (request, response) => {
  searchWeather(request.query.data || 'Lynnwood, WA')
    .then(weatherData => {
      response.send(weatherData);
    })
  // console.log(weatherGet);
})

// from class
function searchToLatLong(query){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
  return superAgent.get(url)
    .then(geoData => {
      const location = new Location(geoData.body.results[0]);
      console.log(location);
      return location;
    })
    .catch(err => console.error(err));
  
}

function searchWeather(query){
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/44,122`;
  // body.results.geometry.location. lat || lng
  console.log(url);
  // how to pull lat/long from google API, then format so we can input it into this URL  
  return superAgent.get(url)
    .then(weatherData => {
      let wArr = weatherData.body.daily.data.map( 
          forecast => {
            let data = {};
            data.forecast = forecast.summary;
            data.time = new Date(forecast.time * 1000).toDateString();
            return data;
          }
        );
      return wArr;
    })
    .catch(err => console.error(err));
}

function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
  // lat = location.geometry.location.lat;
  // long = location.geometry.location.lng;
}

// Error messages
app.get('/*', function(req, res) {
  res.status(404).send('halp, you are in the wrong place');
})

function errorMessage(res){
  res.status(500).send('something went wrong. plzfix.');
} //created a function to handle the 500 errors but not sure what to do with it

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})