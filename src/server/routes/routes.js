const express = require('express');
const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController');
const reqController = require('./reqController');
const passport = require('passport');
const path = require('path');
const integrations = require('./integrations');
const Influencer = require('../db/Influencer');

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

// Account route handlers
reqRoutes.get('/login', reqController.getFrontEnd);
reqRoutes.get('/account/post/:id', reqController.getFrontEnd);
reqRoutes.post('/account/submit_media', reqController.submitMedia);
reqRoutes.post('/account/post/:id/submit_links', reqController.submitLinks);

// ================= Passport Instagram Endpoints ================= //

reqRoutes.get('/logout', (req, res) => {
  console.log('LOGGING OUT USER');
  req.logOut();
  res.redirect('/');
});

reqRoutes.get('/auth/instagram', passport.authenticate('instagram'), 
  (req, res) => {}
);

reqRoutes.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }), 
  (req, res) => {
    req.app.settings.authInfo = req.authInfo;
    res.redirect('/');
  }
);

reqRoutes.get('/account', ensureAuthenticated, (req, res) => {
  // FINDING INFLUENCER on /account endpoint req.session.passport;
  // WITH ACCESS TOKEN: req.app.settings.insta_accessToken;
  Influencer.findById(req.session.passport.user, (err, user) => { 
    if (err) {
      console.log(err);
    } else {
      console.log('SENDING USER from routes /account', user);
      let temp = user;
      temp.media = undefined;
      res.send(temp);
    }
  });
});



// test authentication
function ensureAuthenticated(req, res, next) {
  console.log('ENSURE AUTH:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('GOING TO REDIRECT:');
  res.redirect('/login');
}

// =================================================================== //

// ======================= Instagram Endpoints ======================== //
reqRoutes.get('/account/media', reqController.getMedia);

// ======================== TwoTap API Routes ======================== //
reqRoutes.get('/:username', integrations.integration);
reqRoutes.post('/purchase_confirm_callback', integrations.purchaseConfirmCallback);

module.exports = reqRoutes;
