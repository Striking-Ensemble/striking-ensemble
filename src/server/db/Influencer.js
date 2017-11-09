// influencer schema

const mongoose = require('mongoose');
const db = require('./index.js');

const influencerSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  full_name: String,
  types: [String],
  profile_picture: String,
  bio: String,
  website: String,
  counts: {
    media: Number
  },
  data: []
});

// Register the schema with Mongoose as the Influencer collection
const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
