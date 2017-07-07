const config = require('./config');
const axios = require('axios');
const yargs = require('yargs');

const argv = yargs.options({
    a: {
        demands: true,
        alias: 'address',
        describe: 'Address to be fetched',
        string: true
    }
})
  .help()
  .alias('help', 'h')
  .argv;

let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`
let api_key = config.darksky_api_key;

const convertToCelcius = (temperature) => {
    let temp = temperature - 32;
    return Math.round(temp * 5 / 9);
}

axios.get(geocodeUrl)
    .then( (response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('Unable to find that address.')
        }

        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        let weatherUrl = `https://api.darksky.net/forecast/${api_key}/${lat},${lng}`;
        console.log(response.data.results[0].formatted_address);

        return axios.get(weatherUrl);
    })
    .then( (response) => {
        let temperature = convertToCelcius(response.data.currently.temperature);
        let apparentTemperature = convertToCelcius(response.data.currently.apparentTemperature);
        console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`)
    })
    .catch( (err) => {
        if (err.code === 'ENOTFOUND') {
            console.log('Unable to connect to API servers')
        } else {
            console.log(err.message)
        }
    })
