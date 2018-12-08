'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const weatherArray = [];

//Load env vars;
require('dotenv').config();

const PORT = process.env.PORT || 3000;

//app
const app = express();
app.use(cors());

// Get Location data
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data || 'Lynnwood, WA');
  response.send(locationData);
})

// Get weather data
app.get('/weather', (request, response) => {
  const weatherGet = searchWeather(request.query.data || 'Lynnwood, WA');
  response.send(weatherGet);
})

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function searchWeather(query){
  const weatherData = require('./data/darksky.json');
  for (let i in weatherData.daily.data){
    const forecast = new Forecast(weatherData.daily.data[i]);
  }
  return weatherArray;
}

function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

function Forecast(weather){
  this.forecast = weather.summary;
  this.time = new Date(weather.time * 1000).toDateString(); //from stack overflow "convert unix string to time"

  weatherArray.push(this);
}

// Error messages
app.get('/*', function(req, res) {
  res.status(404).send('you are in the wrong place');
})

function errorMessage(res){
  res.status(500).send('something went wrong');
} //created a function to handle the 500 errors but not sure what to do with it

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})