'use strict';

// ===================== Module Dependencies ========================= //
const config = require('./config/keys');
const express = require('express');
const favicon = require('serve-favicon');
// extracts the entire body portion of incoming req to be used as req.body
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const router = require('./db/influencerRouter');
const reqRoutes = require('./routes/routes');
const passport = require('passport');
const instagramConfig = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Influencer = require('./db/Influencer');
const request = require('request');
const stripe = require('stripe')(config.stripe.secretKey);

// =================================================================== //

// Create the Express application
const app = express();

// **************** Express Setup Below ***************** //

// revisit this after thinking it over whether to use jade
// app.set('views', path.join(__dirname, '../client/views'));
// app.set('view engine', 'jade');

// Sets HTTP headers appropriately for protection
app.use(helmet());

// If node.js behind a proxy and are using { secure: true } for session cookies, 
// need to set "trust proxy" in express:
app.set('trust proxy', 1) // trust first proxy

// caches the icon in memory to improve performance by skipping disk access.
app.use(favicon(path.join(__dirname, '../../public', 'assets', 'images', 'favicon.ico')));
app.use(logger('dev'));

let sess = {
  secret: config.secret,
  name: 'cookie-cookie',
  // Forces the session to be saved back to the session store,
  // even if the session was never modified during the request
  resave: false,
  // should we create cookie session even if user is not logged in?
  saveUninitialized: false,
};

if (app.get('env') !== 'production') {
  const store = new MongoDBStore(
    {
      uri: `mongodb://localhost:27017/connect_mongodb_session`,
      databaseName: 'connect_mongodb_session',
      collection: 'influencerSessions'
    },
    function (error) { console.log('Can\'t connect to MongoDB sessions', error) }
  );
  // Catch errors
  store.on('error', (error) => {
    console.log('Caught error to MongoDB sessions', error);
  });
  sess.store = store;
  sess.cookie = {
    path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
  }
  app.use(session(sess));
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../../webpack.dev');
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    reload: true,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
} else {
  const store = new MongoDBStore(
    {
      uri: `mongodb://${process.env.DBUser}:${process.env.DBPass}@ds249707.mlab.com:49707/striking-ensemble-sandbox-db`,
      // must match with the uri name above
      databaseName: 'striking-ensemble-sandbox-db',
      collection: 'influencerSessions'
    },
    (error) => console.log('Can\'t connect to MongoDB sessions inside the store', error)
  )
  // Catch errors
  store.on('error', (error) => {
    console.log('Caught error to MongoDB sessions on catch', error);
  });
  sess.store = store;
  sess.cookie = {
    path: '/',
    httpOnly: true,
    secure: true, // Send cookies only in HTTPS-enabled website
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  };
  app.use(session(sess));
}

app.set('own_url', (process.env.HOST ? process.env.HOST : process.env.host) || 'http://localhost:3000');
app.set('mobile_url', 'https://checkout.twotap.com');
app.set('twoTap_apiUrl', 'https://api.twotap.com');
app.set('twoTap_public_token', config.twoTap.publicToken);
app.set('twoTap_private_token', config.twoTap.privateToken);
app.set('insta_accessToken', '');

// create insta-pass config
instagramConfig(passport);
// for authentication with passport
app.use(passport.initialize());
app.use(passport.session());

// modify express to take url that contain any format/type of file
app.use(bodyParser.urlencoded({ extended: false }));

// parses the text as JSON and set to req.body
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../../public')));
// set up API routes
app.use('/', reqRoutes);
app.use('/api/*', router);
app.use('/account/p/:id', (req, res) => { res.sendFile(path.join(__dirname, '../../public/index.html')) });
app.use('/:username', (req, res) => { res.sendFile(path.join(__dirname, '../../public/index.html')) });

// ************************************************************ //

module.exports = app;
