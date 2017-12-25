// =============== Purchase Controller ================ //

const express = require('express');
const request = require('request');

exports.integration = (req, res) => {
  console.log('Integration Controller:', process.env.TwoTap_public_token);
  const publicToken = process.env.TwoTap_public_token;
  const customCSSURL = req.query.custome_css_url || 'http://localhost:3000/notnicknick/assets/css/integration_twotap.css';
  const smsConfirmURL = 'http://localhost:3000/purchase_confirm_callback';

  res.send({
    publicToken: publicToken,
    customCSSURL: customCSSURL,
    smsConfirmURL: smsConfirmURL
  })
};

exports.purchaseConfirmCallback = (req, res) => {
  console.log('THIS GOT USED, purchase confirm', req.body);
  console.log('is this even?...', req.app.settings.private_token);
  console.log('check for typeof env tokens:', typeof req.app.settings.private_token)
  let apiURL = 'https://api.twotap.com';
  let purchaseId = req.body.purchase_id;
  let testMode = req.body.test_mode;
  const privateToken = req.app.settings.private_token;

  let callPath = '/v1.0/purchase/confirm?private_token=' + privateToken;

  let queryObj = {
    json: {
      "purchase_id": purchaseId,
      "test_mode": "fake_confirm"
    }
  }

  request.post(apiURL + callPath, queryObj, function (error, response, body) {
    console.log('in purchase confirm:', body)
    res.json(JSON.parse(body));
  });
};
