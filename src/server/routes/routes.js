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

// middleware that is logs time to this router
reqRoutes.use(function timeLog(req, res, next) {
  console.log('Time in Routes file: ', Date.now());
  next();
});

// Account route handlers
reqRoutes.post('/account/submit_media', reqController.submitMedia);
reqRoutes.post('/account/post/:id/submit_links', reqController.submitLinks);

// ================= Passport Instagram Endpoints ================= //

reqRoutes.post('/logout', (req, res) => {
  console.log('LOGGING OUT USER:', req.body.username);
  req.logOut();
  res.redirect(200, '/');
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
      temp.media = undefined;
      res.send(temp);
    }
  });
});

// =================================================================== //

// ======================= Instagram Endpoints ======================== //
reqRoutes.post('/account/media', influencerRequired, reqController.getMedia);

// ======================== TwoTap API Routes ======================== //
reqRoutes.get('/:username/cart', integrations.integration);
reqRoutes.get('/purchase_status/id/:purchase_id', reqController.purchaseStatusController);
reqRoutes.post('/purchase_confirm_callback', reqController.purchaseConfirmController);

// =================================================================== //

// ========================= Stripe Endpoints ======================== //
reqRoutes.get('/billing/stripe/authorize', influencerRequired, reqController.setupPayment);
reqRoutes.get('/billing/stripe/token', influencerRequired, reqController.getStripeToken);
reqRoutes.get('/billing/stripe/transfers', influencerRequired, reqController.getStripeTransfers);
reqRoutes.post('/billing/stripe/payout', influencerRequired, reqController.payout);
reqRoutes.post('/billing/stripe/deactivate', influencerRequired, reqController.deactivate);

// reqRoutes.get('/', (req, res) => {
  //   console.log('TRIGGERED');
  //   if (!req.user || req.user.status !== 'ENABLED') {
    //     return res.redirect('/login');
    //   }
    //   console.log('FOUND USER:', req.user);
    //   res.sendFile(path.resolve(__dirname, '../../../public', 'index.html'));
    // });
    
// Public route handlers here due to paths can be loosely associated with other paths
reqRoutes.get('/user/:username', influencerController.retrieveOne);
reqRoutes.get('/users', influencerController.retrieve);
reqRoutes.get('/:username/media', reqController.getInfluencerPosts);
reqRoutes.get('/:username/media-products', reqController.getMediaProducts);
reqRoutes.get('/:username/post/:instaId', reqController.getPostCatalog);

module.exports = reqRoutes;
