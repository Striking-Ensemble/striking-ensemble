const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController.js');
const reqController = require('./reqController.js');
const passport = require('passport');

// middleware that is specific to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Public route handlers
reqRoutes.get('/:username', (req, res) => {
  console.log('Influencer\'s Page!');
  influencerController.retrieveOne(req, res);
});

reqRoutes.post('/:username/checkout', (req, res) => {
  console.log('READY FOR CHECKOUT');
  reqController.checkout(req, res);
})

reqRoutes.get('/', (req, res) => {
  res.render('login', { user: req.user })
});

reqRoutes.get('/auth/instagram', 
  passport.authenticate('instagram'), 
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
  res.redirect('/');
});

module.exports = reqRoutes;
