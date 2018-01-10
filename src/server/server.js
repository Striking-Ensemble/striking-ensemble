'use strict';

// ===================== Module Dependencies ========================= //
const config = require('./config/keys');
const express = require('express');
// extracts the entire body portion of incoming req to be used as req.body
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
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
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  name: 'cookie-cookie',
  resave: true,
  saveUninitialized: true
}));
app.set('own_url', 'http://localhost:3000');
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
app.use(express.static(path.join(__dirname, '../../public')));

// serialize and deserialize
passport.serializeUser((user, done) => {
  console.log('serializeUser by obj id:', user._id);
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  console.log('DESERIALIZE, should be obj id:', id);
  Influencer.findById(id, (err, user) => {
    (!err) ? done(null, user) : done(err, null);
  })
});

// set up API routes
app.use('/login', express.static(path.join(__dirname, '../../public')));
app.use('/', reqRoutes);
app.use('/api/*', router);
app.use('/account/post/:id', express.static(path.join(__dirname, '../../../public')));
app.use('/:username', express.static(path.join(__dirname, '../../public')));

// ************************************************************ //

module.exports = app;
