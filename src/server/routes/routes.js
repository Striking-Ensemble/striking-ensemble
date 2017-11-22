const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController.js');
const reqController = require('./reqController.js');
const passport = require('passport');
const path = require('path');
const integrations = require('./integrations.js');

// middleware that is specific to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Public route handlers
reqRoutes.get('/user:username', influencerController.retrieveOne);

reqRoutes.post('/:username/checkout', reqController.prepareCheckout);

// ================= Passport Instagram Endpoints ================= //
reqRoutes.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
});

reqRoutes.get('/logout', (req, res) => {
  console.log('IS THIS EVEN ON??', req.logout);
  req.logout();
  res.redirect('/login');
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

reqRoutes.get('/account', ensureAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
// =================================================================== //

// ======================== TwoTap API Routes ======================== //
reqRoutes.get('/', integrations.integration);
reqRoutes.post('/purchase_confirm_callback', integrations.purchaseConfirmCallback);

module.exports = reqRoutes;
