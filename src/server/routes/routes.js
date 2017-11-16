const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController.js');
const reqController = require('./reqController.js');
const passport = require('passport');
const path = require('path');

// middleware that is specific to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Public route handlers
reqRoutes.get('/user:username', (req, res) => {
  console.log('Influencer\'s Page! under USERNAME');
  influencerController.retrieveOne(req, res);
});

reqRoutes.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/public/views/login.html'))
});

reqRoutes.get('/auth/instagram', passport.authenticate('instagram'), 
  (req, res) => {}
);

reqRoutes.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/account');
  }
);

reqRoutes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

reqRoutes.get('/account', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/public/views/account.html'));
});

reqRoutes.post('/:username/checkout', (req, res) => {
  console.log('READY FOR CHECKOUT');
  reqController.checkout(req, res);
})

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = reqRoutes;
