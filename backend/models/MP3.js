const mongoose = require('mongoose');

const mp3Schema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  // Other relevant fields
});

const MP3 = mongoose.model('MP3', mp3Schema);

module.exports = MP3;

