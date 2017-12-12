// instagram posts schema

const mongoose = require('mongoose');
// fix deprecation warning on utilizing save by specifiying native promises
mongoose.Promise = global.Promise;
const db = require('./index');

const mediaSchema = mongoose.Schema({
  _creator: {
    type: Number,
    ref: 'Influencer'
  },
  data: [{ 
    type: ObjectId, 
    retailLinks: [{
      type: ObjectId, 
      index: String, 
      url: String
    }] 
  }]
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
