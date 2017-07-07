const axios = require('axios');
const config = require('../config/config');
const convert = require('./convertToCelcius');

const api_key = config.darksky_api_key;
const weatherUrl = config.weatherUrl;

function geoCodeResult(response) {
  if (response.data.status === 'ZERO_RESULTS') throw new Error('Unable to find that address.')

  let lat = response.data.results[0].geometry.location.lat;
  let lng = response.data.results[0].geometry.location.lng;
  let weatherUrl = `${config.weatherUrl}${api_key}/${lat},${lng}`
  console.log(response.data.results[0].formatted_address);

  return axios.get(weatherUrl);
}

function dataResult(response) {
  let temperature = convert.convertToCelcius(response.data.currently.temperature);
  let apparentTemperature = convert.convertToCelcius(response.data.currently.apparentTemperature);
  console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
}

function dataError(err) {
  err.code === 'ENOTFOUND'
    ? console.log('Unable to connect to API servers')
    : console.log(err.message);
}


module.exports = {
  geoCodeResult: geoCodeResult,
  dataResult: dataResult,
  dataError: dataError
}
