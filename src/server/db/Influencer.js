// influencer schema

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
const db = require('./index');

const influencerSchema = Schema({
  _id: Number,
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
  media: [{type: String}]
});

// Register the schema with Mongoose as the Influencer collection
const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
