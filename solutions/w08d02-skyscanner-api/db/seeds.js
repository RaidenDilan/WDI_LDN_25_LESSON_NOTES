const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const City = require('../models/city');

mongoose.connect(dbURI);

City.collection.drop();

City
  .create([{
    name: 'San Francisco',
    country: 'United States of America',
    airport: 'SFO'
  },{
    name: 'Hong Kong',
    country: 'Hong Kong',
    airport: 'HKG'
  },{
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    airport: 'KUL'
  },{
    name: 'Sydney',
    country: 'Australia',
    airport: 'SYD'
  },{
    name: 'New York',
    country: 'United States of America',
    airport: 'JFK'
  },{
    name: 'Paris',
    country: 'France',
    airport: 'CDG'
  }])
  .then((cities) => {
    console.log(`${cities.length} cities created`);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    mongoose.connection.close();
  });
