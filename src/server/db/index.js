const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/influencers'

// Connect Mongoose to our local MongoDB via URI
mongoose.connect(mongoUri, {useMongoClient: true});

const db = mongoose.connection;
// check our db status
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('We are connected to DB!'));

module.exports = db;
