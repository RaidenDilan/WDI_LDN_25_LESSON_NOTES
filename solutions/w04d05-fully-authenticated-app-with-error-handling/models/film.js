const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: String, required: true, match: /[0-9]{4}-[0-9]{2}-[0-9]{2}/ },
  synopsis: { type: String, maxlength: 255, required: true },
  genre: { type: String },
  wikipedia: { type: String },
  images: [{ type: String }]
});

module.exports = mongoose.model('Film', filmSchema);