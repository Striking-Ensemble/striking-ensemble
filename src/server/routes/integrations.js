// =============== Purchase Controller ================ //

const express = require('express');
const request = require('request');

exports.integration = (req, res) => {
  console.log('Integration Controller:', process.env.twoTap_public_token);
  const publicToken = process.env.twoTap_public_token;
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
  console.log('is this even?...', req.app.settings.twoTap_private_token);
  console.log('check for typeof env tokens:', typeof req.app.settings.twoTap_private_token)
  let apiURL = req.app.settings.twoTap_apiUrl;
  let purchaseId = req.body.purchase_id;
  let testMode = req.body.test_mode;
  const privateToken = req.app.settings.twoTap_private_token;

  let callPath = '/v1.0/purchase/confirm?private_token=' + privateToken;

  let queryObj = {
    form: {
      "purchase_id": purchaseId,
      "test_mode": "fake_confirm"
    }
  }
  request.post(apiURL + callPath, queryObj, (err, response, body) => {
    if (err) {
      console.log('ERROR Detected on purchaseConfirm', err);
    }
    console.log('in purchase confirm:', body)
    res.json(JSON.parse(body));
  });
};

exports.purchaseStatus = (req, res) => {
  console.log('CHECK STATUS OF PURCHASE');
  let apiURL = req.app.settings.twoTap_apiUrl;
  let purchaseId = req.body.purchase_id;
  let test_mode = req.body.test_mode;

  let callPath = '/v1.0/purchase/status?public_token=' + req.app.settings.twoTap_public_token;

  request.get(apiURL + callPath + '&purchase_id' + purchaseId + '&test_mode' + test_mode, (err, response, body) => {
    if (err) {
      console.log('Error in purchase status', err);
    }
    console.log('in purchase status!', body);
    res.send(body);
  });

};
