const mongoose = require('mongoose');

const wonderSchema = new mongoose.Schema({
  name: String,
  country: String,
  image: String,
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Wonder', wonderSchema);
