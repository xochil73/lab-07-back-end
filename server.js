'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
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
      return location;
    })
    .catch(err => console.error(err));
  
}

function searchWeather(query){
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/47.85356789999999,-122.34211`;
  // console.log(url);
  // console.log(superAgent.get(url));
  return superAgent.get(url)
    .then(weatherData => {
      // console.log(weatherData.body.daily.data);
      
      let wArr = weatherData.body.daily.data.map( 
          forecast => {
            let data = {};
            data.forecast = forecast.summary;
            data.time = new Date(forecast.time * 1000).toDateString();
            return data;
          }
        );
        // for (let i in weatherData.daily.data){
          //   const forecast = new Forecast(weatherData.daily.data[i]);
      // }
      console.log(wArr);
      return wArr;
    })
    .catch(err => console.error(err));
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
  res.status(404).send('halp, you are in the wrong place');
})

function errorMessage(res){
  res.status(500).send('something went wrong. plzfix.');
} //created a function to handle the 500 errors but not sure what to do with it

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})