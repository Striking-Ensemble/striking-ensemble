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
const cookieParser = require('cookie-parser');
const session = require('express-session');
const store = require('store');
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

// If node.js behind a proxy and are using secure: true for session cookies, 
// need to set "trust proxy" in express:
app.set('trust proxy', 1) // trust first proxy

// caches the icon in memory to improve performance by skipping disk access.
app.use(favicon(path.join(__dirname, '../../public', 'assets', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  name: 'cookie-cookie',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/', httpOnly: true, secure: false, maxAge: null // changes needed for production
  }
}));

if (app.get('env') !== 'production') {
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
app.use('/public', express.static(path.join(__dirname, '../../public')));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../public/index.html')) })

// serialize and deserialize
passport.serializeUser((user, done) => {
  console.log('serializeUser by obj id:', user._id);
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  console.log('DESERIALIZE, should be obj id:', id);
  Influencer.findById(id, (err, user) => {
    // (!err) ? done(null, user) : done(err, null);
    done(err, user);
  })
});

// set up API routes
app.use('/', reqRoutes);
app.use('/api/*', router);
app.use('/account/p/:id', (req, res) => { res.sendFile(path.join(__dirname, '../../public/index.html')) });
app.use('/:username', express.static(path.join(__dirname, '../../public')));

// ************************************************************ //

module.exports = app;
