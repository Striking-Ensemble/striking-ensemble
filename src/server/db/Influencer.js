// influencer schema

const mongoose = require('mongoose');
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
const db = require('./index');


const influencerSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  profile_picture: String,
  full_name: String,
  bio: String,
  website: String,
  counts: {
    media: Number,
    follows: Number,
    followed_by: Number
  },
  is_business: Boolean,
  data: []
});

// Register the schema with Mongoose as the Influencer collection
const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
