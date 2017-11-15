const express = require('express');
// extracts the entire body portion of incoming req to be used as req.body
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./db/influencerRouter.js');
const reqRoutes = require('./routes/routes.js');
const passport = require('passport');
const instagramConfig = require('./config/passport.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// serialize and deserialize
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// config
instagramConfig(passport);

// Create the Express application
const app = express();

app.use(cookieParser());

// ============ for authentication with passport ==============//
app.use(session( {secret: 'sessionSecret'} ));
app.use(passport.initialize());
app.use(passport.session());

// modify express to take url that contain any format/type of file
app.use(bodyParser.urlencoded({ extended: false }));

// parses the text as JSON and set to req.body
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/public/')));

// set up API routes
app.use('/api', router);
app.use('/', reqRoutes);
app.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', { user: req.user });
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = app;
