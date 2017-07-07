const config = require('./config/config');
const axios = require('axios');
const yargs = require('yargs');

const a = require('./config/yargs-config');
const convertToCelcius = require('./helpers/convertToCelcius');

const argv = yargs.options({ a })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeUrl =  `${config.geocodeUrl}${encodedAddress}`
const api_key = config.darksky_api_key;

axios.get(geocodeUrl)
    .then( res => geoCodeResult(res))
    .then(res => dataResult(res))
    .catch(err => dataError(err))

    function geoCodeResult(response) {

        if (response.data.status === 'ZERO_RESULTS') throw new Error('Unable to find that address.')

        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        let weatherUrl = `${config.weatherUrl}${api_key}/${lat},${lng}`
        console.log(response.data.results[0].formatted_address);

        return axios.get(weatherUrl);
    }

    function dataResult(response) {
        let temperature = convertToCelcius(response.data.currently.temperature);
        let apparentTemperature = convertToCelcius(response.data.currently.apparentTemperature);
        console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
    }

    function dataError(err) {
        err.code === 'ENOTFOUND'
            ? console.log('Unable to connect to API servers')
            : console.log(err.message);
    }
