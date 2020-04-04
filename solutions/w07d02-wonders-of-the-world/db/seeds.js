const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Wonder = require('../models/wonder');

const { dbURI } = require('../config/environment');

mongoose.connect(dbURI);

Wonder.collection.drop();

Wonder
  .create([{
    name: 'GreatWall of China',
    country: 'China',
    image: 'http://i.imgur.com/vuRaVYg.jpg',
    location: {
      lat: 40.432087,
      lng: 116.570375
    }
  }, {
    name: 'Christ the Redeemer Statue',
    country: 'Brazil',
    image: 'http://i.imgur.com/UbElY8i.jpg',
    location: {
      lat: -22.951946,
      lng: -43.210497
    }
  }, {
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'http://i.imgur.com/sO28Y3j.jpg',
    location: {
      lat: 13.162974,
      lng: -72.544984
    }
  }, {
    name: 'Chichen Itza',
    country: 'Mexico',
    image: 'http://i.imgur.com/UX0eXfj.jpg',
    location: {
      lat: 20.684295,
      lng: -88.567772
    }
  }, {
    name: 'The Roman Colosseum',
    country: 'Italy',
    image: 'http://i.imgur.com/d2IedTx.jpg',
    location: {
      lat: 41.890218,
      lng: 12.492188
    }
  }, {
    name: 'Taj Majal',
    country: 'India',
    image: 'http://i.imgur.com/UrqXcrc.jpg',
    location: {
      lat: 27.175015,
      lng: 78.042134
    }
  }, {
    name: 'Petra',
    country: 'Jordan',
    image: 'http://i.imgur.com/pNcqT6s.jpg',
    location: {
      lat: 30.328473,
      lng: 35.444373
    }
  }])
  .then((wonders) => console.log(`${wonders.length} wonders created!`))
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
