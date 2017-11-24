const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController');
const reqController = require('./reqController');
const passport = require('passport');
const path = require('path');
const integrations = require('./integrations');

// middleware that is specific to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Public route handlers
// reqRoutes.get('/', (req, res) => {
//   console.log('TRIGGERED');
//   if (!req.user || req.user.status !== 'ENABLED') {
//     return res.redirect('/login');
//   }
//   console.log('FOUND USER:', req.user);
//   res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
// });

reqRoutes.get('/user:username', influencerController.retrieveOne);

reqRoutes.post('/:username/checkout', reqController.prepareCheckout);

// ================= Passport Instagram Endpoints ================= //
reqRoutes.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
});

reqRoutes.get('/logout', (req, res) => {
  console.log('LOGGING OUT USER');
  req.logout();
  res.redirect('/login');
});

reqRoutes.get('/auth/instagram', passport.authenticate('instagram'), 
  (req, res) => {}
);

reqRoutes.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }), 
  (req, res) => {
    res.redirect('/');
  }
);

reqRoutes.get('/account', ensureAuthenticated, (req, res) => {
  console.log('OTHER RES STUFF:', req.user);
  // res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
  let user = req.user;
  user.isAuthenticated = req.isAuthenticated();
  res.send(user);
});


// test authentication
function ensureAuthenticated(req, res, next) {
  console.log('AUTH FUNC:', req.isAuthenticated);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
// =================================================================== //

// ======================== TwoTap API Routes ======================== //
reqRoutes.get('/:username', integrations.integration);
reqRoutes.post('/purchase_confirm_callback', integrations.purchaseConfirmCallback);

module.exports = reqRoutes;
