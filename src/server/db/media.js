// instagram posts schema

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
const db = require('./index');

const mediaSchema = Schema({
  _id: String,
  _creator: {
    type: Number,
    ref: 'Influencer'
  },
  caption: { type: [{
    id: String,
    text: String,
    created_time: String
  }]},
  created_time: String,
  images: { type: [{
    low_resolution: { type: [{
      width: Number,
      height: Number,
      url: String
    }]},
    standard_resolution: { type: [{
      width: Number,
      height: Number,
      url: String
    }]},
    thumbnail: { type: [{
      width: Number,
      height: Number,
      url: String
    }]}
  }]},
  link: String,
  tags: Array,
  post_type: String,
  videos: { type: [{
    low_bandwidth: { type: [{
      width: Number,
      height: Number,
      url: String
    }]},
    low_resolution: { type: [{
      width: Number,
      height: Number,
      url: String
    }]},
    standard_resolution: { type: [{
      width: Number,
      height: Number,
      url: String
    }]}
  }]},
  retailLinks: { type: [{ 
    index: String, 
    url: String
  }]}
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
