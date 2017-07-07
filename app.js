const config = require('./config/config');
const axios = require('axios');
const yargs = require('yargs');

const a = require('./config/yargs-config');
const convertToCelcius = require('./helpers/convertToCelcius');
const weatherApp = require('./helpers/weather-app');

const argv = yargs.options({ a })
  .help()
  .alias('help', 'h')
  .argv;

const encodedAddress = encodeURIComponent(argv.a);
const geocodeUrl =  `${config.geocodeUrl}${encodedAddress}`

axios.get(geocodeUrl)
    .then( res => weatherApp.geoCodeResult(res))
    .then(res => weatherApp.dataResult(res))
    .catch(err => weatherApp.dataError(err))
