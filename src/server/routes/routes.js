const express = require('express');
const reqRoutes = require('express').Router();
const bodyParser = require('body-parser');
const influencerController = require('../db/influencerController');
const reqController = require('./reqController');
const passport = require('passport');
const path = require('path');
const integrations = require('./integrations');
const Influencer = require('../db/Influencer');
const influencerRequired = require('../middleware/influencerRequired');

// middleware logs time to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// ================= Passport Instagram Endpoints ================= //
reqRoutes.post('/logout', (req, res) => {
  console.log('LOGGING OUT USER:', req.body.username);
  req.logOut();
  // attaches a new expiration date on the header
  // so that cookie in browser will be delete since
  // it is set to expire at this time
  req.session.cookie.expires = new Date(Date.now());
  res.redirect(200, '/');
});

reqRoutes.get('/auth/instagram', passport.authenticate('instagram'));

reqRoutes.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }), 
  (req, res) => {
    req.app.settings.authInfo = req.authInfo;
    res.redirect('/');
  }
);

reqRoutes.get('/account', influencerRequired, (req, res) => {
  // FINDING INFLUENCER on /account endpoint req.session.passport;
  // WITH ACCESS TOKEN: req.app.settings.insta_accessToken;
  Influencer.findById(req.session.passport.user, (err, user) => { 
    if (err) {
      console.log(err);
    } else {
      console.log('SENDING USER from routes /account', user);
      if (user === null) {
        res.redirect(404, '/login');
      }
      let temp = user;
      temp.accessToken = undefined;
      temp.media = undefined;
      res.send(temp);
    }
  });
});
// =================================================================== //

// ======================= Instagram Endpoints ======================== //
// Account route handlers
reqRoutes.get('/account/post/:id', influencerRequired, reqController.getInstaPost);
reqRoutes.post('/account/submit_media', influencerRequired, reqController.submitMedia);
reqRoutes.post('/account/post/:id/submit_links', influencerRequired, reqController.submitLinks);
reqRoutes.post('/account/media', influencerRequired, reqController.getMedia);

// ======================== Google Reporting ========================= //
reqRoutes.post('/reports/affiliate', influencerRequired, reqController.getReports);

// ======================== TwoTap API Routes ======================== //
reqRoutes.get('/:username/cart', integrations.integration);
reqRoutes.get('/purchase_status/id/:purchase_id', reqController.purchaseStatusController);
reqRoutes.post('/purchase_confirm_callback', reqController.purchaseConfirmController);
reqRoutes.post('/purchase_updated_callback', integrations.purchaseUpdatedCallback)
// =================================================================== //

// ========================= Stripe Endpoints ======================== //
reqRoutes.get('/billing/stripe/authorize', influencerRequired, reqController.setupPayment);
reqRoutes.get('/billing/stripe/token', influencerRequired, reqController.getStripeToken);
reqRoutes.get('/billing/stripe/balance', influencerRequired, reqController.getBalance);
reqRoutes.get('/billing/stripe/commision-info', influencerRequired, reqController.getCommisionInfo);
reqRoutes.get('/billing/stripe/transfers', influencerRequired, reqController.getStripeTransfers);
reqRoutes.get('/billing/stripe/transfer-funds', influencerRequired, reqController.transferFund);
reqRoutes.post('/billing/stripe/payout', influencerRequired, reqController.payout);
reqRoutes.get('/billing/stripe/payout-list', influencerRequired, reqController.getPayoutList);
reqRoutes.post('/billing/stripe/deactivate', influencerRequired, reqController.deactivate);
    
// Public route handlers here due to paths can be loosely associated with other paths
reqRoutes.get('/user/:username', influencerController.retrieveOne);
reqRoutes.get('/users', influencerController.retrieve);
reqRoutes.get('/:username/media', reqController.getInfluencerPosts);
reqRoutes.get('/:username/media-products', reqController.getMediaProducts);
reqRoutes.get('/:username/post/:instaId', reqController.getPostCatalog);
reqRoutes.get('/u/:username/post/:id', reqController.getInstaPost);

module.exports = reqRoutes;
