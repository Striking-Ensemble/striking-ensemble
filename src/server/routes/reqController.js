const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
const passport = require('passport');

// Controller methods for TwoTap
const twoTapApiURL = 'https://checkout.twotap.com/prepare_checkout';
const instaApiURL = 'https://api.instagram.com/v1/users/self/media/recent';

exports.prepareCheckout = (req, res) => {
  console.log('READY FOR CHECKOUT');
  let checkoutRequest = req.body;
  checkoutRequest.products = JSON.parse(req.body.products);
  checkoutRequest.confirm = {
    method: 'sms',
    sms_confirm_url: 'http://localhost:3000/purchase_confirm_callback'
  };
  checkoutRequest.public_token = process.env.TwoTap_public_token;
  checkoutRequest.unique_token = (Math.floor(Math.random() * 9999999) + 1).toString();
  console.log('CONTENTS OF checkReq', checkoutRequest);
  
  const callPath = '';

  request.post(apiURL, { checkout_request: checkoutRequest }, (err, res, body) => {
    if (err) {
      throw err;
    }
    console.log('FROM TT', body);
    res.json(JSON.parse(body));
  });
};

// ======================================================================= //

// Controller methods for Instagram

exports.getMedia = (req, res) => {
  let options = {
    url: instaApiURL + '/?access_token=' + req.app.settings.insta_accessToken
  };
  request.get(options, (err, response, body) => {
    if (err) {
      throw err;
    }
    res.json(JSON.parse(body));
  });
}

// Let the front-end handle the rendering
exports.getFrontEnd = (req, res) => {
  console.log('NEW TRIGGER');
  res.app.use(express.static(path.join(__dirname, '../../../public')));
  res.end();
};