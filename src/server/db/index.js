const mongoose = require('mongoose');
let mongoUri;
if (process.env.HostedDB === 'false') {
  mongoUri = 'mongodb://localhost/influencers';
}

if (process.env.HostedDB === 'true') {
  mongoUri = `mongodb://${process.env.DBUser}:${process.env.DBPass}@ds249707.mlab.com:49707/striking-ensemble-sandbox-db`;
}

const dbOptions = {
  useMongoClient: true,
  autoReconnect: true,
  // For PRODUCTION, uncomment autoIndex field!
  // autoIndex: false,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  // If not connected, return errors immediately rather than waiting for reconnect
  // Set this option to 0 and set bufferCommands to *false on your schemas 
  // If you want your database operations to fail immediately 
  // When the driver is not connected,
  bufferMaxEntries: 0,
  keepAlive: 300000, // for long running applications
  connectTimeoutMS: 300000,
  socketTimeoutMS: 300000,
  // sockets may need to be increased if we have few slow queries
  // blocking faster queries. Default: 5
  poolSize: 5
}
// Connect Mongoose to our local MongoDB via URI
mongoose.connect(mongoUri, dbOptions);

const db = mongoose.connection;
// check our db status
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('We are connected to DB!'));

module.exports = db;
