// influencer schema

const mongoose = require('mongoose');
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
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
  profile_picture: String,
  bio: String,
  website: String,
  counts: {
    media: Number
  },
  type: String,
  data: []
});

// Register the schema with Mongoose as the Influencer collection
const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
